const readline = require('readline-sync');
const Spinnies = require('spinnies');

class CLIView {
  constructor() {
    // Initialize the Spinnies spinner
    this.spinnies = new Spinnies();
  }
  
  // Display a message with a spinner
  displayMessage(id, message) {
    this.spinnies.add(id, { text: message });
  }

  // Display a success message and stop the spinner
  displaySuccessMessage(id, message) {
    this.spinnies.succeed(id, { text: message });
  }

  // Display a failed message and stop the spinner
  displayFailedMessage(id, message) {
    this.spinnies.fail(id, { text: message });
  }

  // Get user input from the command line
  getInput(prompt) {
    return readline.question(prompt);
  }

  // Get password input from the command line with masked output
  getPasswordInput(prompt) {
    return readline.question(prompt, {
      hideEchoBack: true,
      mask: '*',
    });
  }
}

module.exports = CLIView;