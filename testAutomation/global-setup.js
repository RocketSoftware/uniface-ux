// global-setup.js
export default async () => {
    const originalLog = console.log;
  
    console.log = function (...args) {
      if (args.some(arg => typeof arg === 'string' && arg.includes('attachment'))) {
        return; // Skip logging this message
      }
      originalLog.apply(console, args); // Call the original console.log for other messages
    };
  };
  