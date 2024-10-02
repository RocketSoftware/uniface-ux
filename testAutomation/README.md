## Automation for UX-Widget Tests
- by Sparsh Gupta
- 2024-06-27

## Introduction

This repository contains a suite of automated tests for automation of uniface ux-widgets tests using Playwright, a Node.js library to automate Chromium, Firefox, and WebKit with a single API. Playwright is designed to enable reliable end-to-end testing and is useful for automating web interactions.

## Table of Contents

- [Features](##Features)
- [Prerequisites](##Prerequisites)
- [Installation] (##Installation)
- [Running Tests](##Running Tests)
- [Reporting](##Reporting)

## Features

- Cross-browser testing with Chromium, Firefox, and WebKit
- Parallel test execution
- Screenshot capture on test failure
- Customizable test runners
- CI/CD integration
- Allure report support

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (version 12 or later) : If you don't have Node.js installed, download and install it from [Node.js official website](https://nodejs.org/)
- npm (version 6 or later) or yarn : Node.js installation includes npm, the Node package manager.
- Playwright: Install Playwright using npm.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   
    git clone git@gitlab.com:Uniface/sources/ux-widgets.git
   
2. Navigate to the project directory:
    
    cd testAutomation
    
3. Install the dependencies:
    
    npm install
    
4. Install Playwright browsers:

    npx playwright install
    
5. Start your Tomcat server with ux-widgets webapp deployed. The URL of index.page is
   hard-corded in testAutomation\pageobjects\BasePage.js as:
     http://localhost:8080/ux-widgets/test/index.html
    
6. Running Tests

	To run the Playwright tests, use the following command:

	npx playwright test


## Running Tests

* Running All Tests
  To run all tests, execute:
	npx playwright test

* Running a Specific Test
  To run a specific test file, execute:
    npx playwright test path/to/UXWidgetUnitTest.spec.js

* Running Tests in Headless Mode
  By default, Playwright runs tests in headless mode. To run tests in headed mode, use the --headed option:
	npx playwright test --headed

* Run tests with a specific tag (assuming you use test annotations):
	npx playwright test --grep @tagname


## Reporting

* Generate a HTML report:
	
   1. Run the tests normally using
		npx playwright test
   2. View report using:
		npx playwright show-report

* Generate a Allure report:
  
  To generate an Allure report in Playwright, you'll need to integrate Allure with your Playwright tests. Here are the steps to do this:

   1. Install Allure and related packages:
		You'll need to install allure-playwright, allure-commandline, and @playwright/test if you haven't already.
		
		npm install @playwright/test allure-playwright allure-commandline --save-dev
	
   2. Configure Playwright to use Allure:
		Add Allure as a reporter in your Playwright configuration file (playwright.config.js)
	
   3. Run your tests:
	    Run your tests as usual. Allure results will be generated in the allure-results folder.
		
		npx playwright test
		
   4. Generate the Allure report:
		Use the Allure command line tool to generate the report.
		
		npx allure generate allure-results --clean -o allure-report
   
   5. Open the Allure report:
		Open the generated report in your browser.

		npx allure open allure-report
