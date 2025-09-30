import os
import shutil
import subprocess
import sys
import requests
import time
from datetime import datetime, timezone
import platform

"""
============= SCRIPT USAGE =============
Usage: python scripts/github_sync.py <GITLAB_TAG>
Example: python scripts/github_sync.py 10.4.03.023
This will compare the GitLab tag directly with the main branch in GitHub.
"""

# ===== STEP 0 — ARGUMENT HANDLING =====
if len(sys.argv) >= 2:
    raw_gitlab_tag = sys.argv[1]
    PATCH_NUMBER = raw_gitlab_tag  # derive patch number from GitLab tag
else:
    print("Usage: python sync_script.py <GITLAB_TAG>")
    sys.exit(1)

# ===== STEP 0.1 — NORMALIZE TAG =====
GITLAB_TAG = raw_gitlab_tag[1:] if raw_gitlab_tag.startswith("v") else raw_gitlab_tag

# ===== STEP 1 — CONFIGURATION =====
GITLAB_REPO_URL = "git@gitlab.rocketsoftware.com:uniface/sources/ux-widgets.git"
GITHUB_REPO_URL = "git@github.com:RocketSoftware/uniface-ux.git"
GITHUB_API_URL = "https://api.github.com/repos/RocketSoftware/uniface-ux/pulls"
DELETE_SCRIPTS_AFTER_RUN = True
FILES_TO_REMOVE = [".idea/", "tsconfig.json", ".gitlab-ci.yml", "polaris.yml"]

# ===== STEP 2 — PATHS =====
if platform.system() == "Windows":
    LOCAL_DIR = os.getenv("LOCAL_DIR", r"C:\syncGithub\ux-widgets")
    TEMP_DIR = os.getenv("TEMP_DIR", os.path.join(os.environ.get("OneDrive", r"C:\Temp"), "github_sync_temp"))
else:
    LOCAL_DIR = os.getenv("LOCAL_DIR", "/tmp/ux-widgets")
    TEMP_DIR = os.getenv("TEMP_DIR", "/tmp/github_sync_temp")

# ===== STEP 3 — BRANCH NAME =====
BRANCH_NAME = f"sync-on-{datetime.now(timezone.utc):%Y%m%d-%H%M}-with-{PATCH_NUMBER.replace('.', '-')}"

# ===== STEP 4 — SELF-COPY AND RERUN IF NOT CI =====
is_ci = os.getenv("CI", "false").lower() == "true"
if not is_ci:
    os.makedirs(TEMP_DIR, exist_ok=True)
    temp_file = os.path.join(TEMP_DIR, os.path.basename(__file__))
    if os.path.abspath(__file__) != os.path.abspath(temp_file):
        shutil.copy2(__file__, temp_file)
        print(f"[INFO] Copied script to {temp_file}")
        result = subprocess.run([sys.executable, temp_file] + sys.argv[1:])
        sys.exit(result.returncode)

# ===== STEP 5 — CLONE GITHUB REPO IF NOT PRESENT =====
if not os.path.exists(LOCAL_DIR):
    subprocess.run(["git", "clone", GITHUB_REPO_URL, LOCAL_DIR], check=True)

# ===== STEP 6 — ADD GITLAB REMOTE IF NOT PRESENT =====
remotes = subprocess.check_output(["git", "-C", LOCAL_DIR, "remote"]).decode().split()
if "gitlab" not in remotes:
    subprocess.run(["git", "-C", LOCAL_DIR, "remote", "add", "gitlab", GITLAB_REPO_URL], check=True)

# ===== STEP 7 — FETCH REMOTES AND TAGS =====
subprocess.run(["git", "-C", LOCAL_DIR, "fetch", "origin"], check=True)
try:
    subprocess.run(["git", "-C", LOCAL_DIR, "fetch", "gitlab", "--tags", "--force"], check=True, stderr=subprocess.DEVNULL)
except subprocess.CalledProcessError:
    print("[WARN] GitLab tags fetch failed, continuing...")
subprocess.run(["git", "-C", LOCAL_DIR, "fetch", "--tags", "--force", "origin"], check=True)

# ===== STEP 8 — VERIFY GITLAB TAG EXISTS BEFORE BRANCH CREATION =====
result = subprocess.run(["git", "-C", LOCAL_DIR, "rev-parse", f"refs/tags/{GITLAB_TAG}"],
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
if result.returncode != 0:
    print(f"[ERROR] GitLab tag '{GITLAB_TAG}' does not exist in gitlab repository.")
    sys.exit(1)

# ===== STEP 9 — CHECKOUT MAIN AND CREATE BRANCH =====
subprocess.run(["git", "-C", LOCAL_DIR, "checkout", "main"], check=True)
subprocess.run(["git", "-C", LOCAL_DIR, "pull", "origin", "main"], check=True)
subprocess.run(["git", "-C", LOCAL_DIR, "checkout", "-b", BRANCH_NAME], check=True)

# ===== STEP 10 — SQUASH MERGE GITLAB TAG CONTENTS =====
# Get commit hash of the GitLab tag
try:
    tag_commit = subprocess.check_output(
        ["git", "-C", LOCAL_DIR, "rev-parse", f"refs/tags/{GITLAB_TAG}"]
    ).decode().strip()
except subprocess.CalledProcessError:
    print(f"[ERROR] GitLab tag '{GITLAB_TAG}' does not exist.")
    sys.exit(1)

# Create a temporary branch from the tag commit
TEMP_TAG_BRANCH = f"temp-tag-{PATCH_NUMBER.replace('.', '-')}"
existing_branches = subprocess.check_output(["git", "-C", LOCAL_DIR, "branch"]).decode().split()
if TEMP_TAG_BRANCH in [b.strip("* ").strip() for b in existing_branches]:
    subprocess.run(["git", "-C", LOCAL_DIR, "branch", "-D", TEMP_TAG_BRANCH], check=True)
    print(f"[INFO] Deleted existing temp branch '{TEMP_TAG_BRANCH}'")

subprocess.run(["git", "-C", LOCAL_DIR, "checkout", "-b", TEMP_TAG_BRANCH, tag_commit], check=True)
print(f"[INFO] Created temp branch '{TEMP_TAG_BRANCH}' from tag commit.")

# Switch back to the sync branch
subprocess.run(["git", "-C", LOCAL_DIR, "checkout", BRANCH_NAME], check=True)

# Perform squash merge with unrelated histories allowed
try:
    subprocess.run([
        "git", "-C", LOCAL_DIR, "merge", "--squash", "--allow-unrelated-histories", TEMP_TAG_BRANCH
    ], check=True)
    print(f"[INFO] Squash merge from GitLab tag '{GITLAB_TAG}' completed.")
except subprocess.CalledProcessError:
    print(f"[WARN] Merge conflicts detected during squash merge. Attempting auto-resolution...")

    # Auto-resolve conflicts by favoring GitLab tag content
    try:
        subprocess.run(["git", "-C", LOCAL_DIR, "checkout", "--theirs", "."], check=True)
        subprocess.run(["git", "-C", LOCAL_DIR, "add", "."], check=True)
        subprocess.run(["git", "-C", LOCAL_DIR, "commit", "-m", f"Squashed changes from GitLab tag {PATCH_NUMBER}"], check=True)
        print("[INFO] Conflicts resolved automatically by favoring GitLab tag content.")
    except subprocess.CalledProcessError:
        print("[ERROR] Auto-resolution of conflicts failed. Please resolve manually.")
        sys.exit(1)

# Delete the temporary branch after merge
subprocess.run(["git", "-C", LOCAL_DIR, "branch", "-D", TEMP_TAG_BRANCH], check=True)
print(f"[INFO] Deleted temp branch '{TEMP_TAG_BRANCH}' after squash merge.")


# ===== STEP 11 — REMOVE UNWANTED FILES =====
for unwanted in FILES_TO_REMOVE:
    path = os.path.join(LOCAL_DIR, unwanted)
    if os.path.exists(path):
        shutil.rmtree(path) if os.path.isdir(path) else os.remove(path)
        print(f"[INFO] Removed {unwanted}")

# Remove scripts folder from filesystem only
scripts_path = os.path.join(LOCAL_DIR, "scripts")
if DELETE_SCRIPTS_AFTER_RUN and os.path.exists(scripts_path):
    try:
        shutil.rmtree(scripts_path)
        print("[INFO] Removed scripts folder")
    except PermissionError:
        print("[WARN] Could not remove scripts folder (in use). Will remove from git index only.")

# ===== STEP 12 — STAGE CHANGES =====
subprocess.run(["git", "-C", LOCAL_DIR, "add", "."], check=True)

# ===== STEP 13 — CHECK FOR ACTUAL CHANGES BEFORE COMMIT =====
print("[INFO] Checking for actual file changes...")
diff_check = subprocess.run(["git", "-C", LOCAL_DIR, "diff", "--cached", "--quiet"])
if diff_check.returncode == 0:
    print("[INFO] No file changes detected after squash merge. Skipping commit and PR creation.")
    sys.exit(0)

# ===== STEP 14 — COMMIT CHANGES =====
subprocess.run([
    "git", "-C", LOCAL_DIR, "commit", "-m",
    f"Sync for patch {PATCH_NUMBER}"
], check=True)

# ===== STEP 15 — PUSH AND CREATE PR =====
subprocess.run(["git", "-C", LOCAL_DIR, "push", "-u", "origin", BRANCH_NAME], check=True)

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
if not GITHUB_TOKEN:
    raise Exception("GITHUB_TOKEN environment variable not set")

headers = {"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github.v3+json"}
data = {
    "title": f"Sync {PATCH_NUMBER} on {datetime.now(timezone.utc):%Y%m%d-%H%M}",
    "head": BRANCH_NAME,
    "base": "main",
    "body": f"Automated sync for patch {PATCH_NUMBER}"
}
response = requests.post(GITHUB_API_URL, headers=headers, json=data)
if response.status_code == 201:
    print("Pull request created:", response.json()["html_url"])
else:
    print("Failed to create pull request:", response.content)

# ===== STEP 16 — ENSURE SCRIPTS FOLDER REMOVED FROM GIT INDEX =====
if DELETE_SCRIPTS_AFTER_RUN:
    subprocess.run(
        ["git", "-C", LOCAL_DIR, "rm", "-r", "--cached", "--ignore-unmatch", "scripts"],
        check=True
    )

    # Commit & push if git index has changes
    result = subprocess.run(["git", "-C", LOCAL_DIR, "diff", "--cached", "--quiet"])
    if result.returncode != 0:
        subprocess.run(
            ["git", "-C", LOCAL_DIR, "commit", "-m", "Remove scripts folder after execution"],
            check=True
        )
        subprocess.run(["git", "-C", LOCAL_DIR, "push", "origin", BRANCH_NAME], check=True)
        print("[INFO] Scripts folder removal committed & pushed.")
    else:
        print("[INFO] No git changes after removing scripts folder.")