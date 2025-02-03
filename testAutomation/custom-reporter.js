class CustomReporter {
  constructor() {
    this.uniqueTests = new Set(); // Track unique tests
    this.failedTestNames = new Set(); // Track unique failed tests
    this.passedTests = 0;
    this.failedTests = 0;
    this.skippedTests = 0; // Track skipped tests
  }

  onTestEnd(test, result) {
    console.log(`Test: ${test.title}, Status: ${result.status}, Retry: ${result.retry}`);
    this.uniqueTests.add(test.title); // Add each test to the set of unique tests

    if (result.status === 'passed') {
      this.passedTests++;
      // If the test passes after a retry, ensure it's not counted as a failure
      if (this.failedTestNames.has(test.title)) {
        this.failedTestNames.delete(test.title);
        this.failedTests--; // Adjust failure count
      }
    } else if (result.status === 'failed' || result.status === 'timedOut') {
      // Only count failures for the first retry
      if (result.retry === 0 && !this.failedTestNames.has(test.title)) {
        this.failedTests++;
        this.failedTestNames.add(test.title); // Track unique failures
      }
    } else if (result.status === 'skipped') { // Check for skipped tests
      this.skippedTests++;
    }
  }

  onEnd() {
    const reset = '\x1b[0m';
    const green = '\x1b[32m';
    const red = '\x1b[31m';
    const yellow = '\x1b[33m';
    const cyan = '\x1b[36m';
    const blue = '\x1b[94m';

    console.log(`\n${cyan}--- Summary Report ---${reset}`);

    console.log(`\n${blue}📊 Total Tests: ${this.uniqueTests.size}${reset}`); // Count unique tests
    console.log(`${green}✅ Test Passed: ${this.passedTests}${reset}`);
    console.log(`${red}❌ Test Failed: ${this.failedTests}${reset}`); // Count unique failed tests
    console.log(`${yellow}⚠️ Test Skipped: ${this.skippedTests}${reset}`); // Count skipped tests
  }
}

module.exports = CustomReporter;
