class CustomReporter {
  constructor() {
    this.totalTests = 0; // Track total test executions
    this.uniqueTests = new Set(); // Track unique test titles
    this.failedTestNames = new Set(); // Track unique failed tests
    this.passedTests = 0;
    this.failedTests = 0;
    this.skippedTests = 0; // Track skipped tests
  }

  onTestEnd(test, result) {
    console.log(`Test: ${test.title}, Status: ${result.status}, Retry: ${result.retry}`);

    this.uniqueTests.add(test.title); // Track unique test titles only
    this.totalTests++; // Count every test execution (across all browsers)

    if (result.status === 'passed') {
      this.passedTests++;
      // Remove from failed if it later passes
      if (this.failedTestNames.has(test.title)) {
        this.failedTestNames.delete(test.title);
        this.failedTests--;
      }
    } else if (result.status === 'failed' || result.status === 'timedOut') {
      if (result.retry === test.retries) {
        this.failedTests++;
        this.failedTestNames.add(test.title);
      }
    } else if (result.status === 'skipped') {
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
    console.log(`\n${blue}📊 Unique Tests: ${this.uniqueTests.size}${reset}`); // Count unique test titles only
    console.log(`${blue}📊 Total Test Executions: ${this.totalTests}${reset}`); // Total test executions across browsers
    console.log(`${green}✅ Test Passed: ${this.passedTests}${reset}`);
    console.log(`${red}❌ Test Failed: ${this.failedTests}${reset}`);
    console.log(`${yellow}⚠️ Test Skipped: ${this.skippedTests}${reset}`);
    }
  }
module.exports = CustomReporter;
