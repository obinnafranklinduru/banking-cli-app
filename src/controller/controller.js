const bcrypt = require('bcrypt');

const Account = require('../model/account.model');
const User = require('../model/user.model');
const CLIView = require('../view/cli.view');

class Controller {
  constructor() {
    // The ID of the currently logged-in user
    this.currentUserId = null;

    // Create an instance of the CLIView for user interface
    this.cliView = new CLIView();
  }

  async register() {
    // Prompt the user to enter a username and password
    const username = this.cliView.getInput('Enter a username: ');
    const password = this.cliView.getPasswordInput('Enter a password: ');

    try {
      this.cliView.displayMessage('register', 'Registering user...');

      // Check if the entered username already exists in the database
      const duplicatedUsername = await User.findOne({ username });
    
      if (duplicatedUsername) {
        this.cliView.displayFailedMessage('register', 'Username already exists. Please try again.');
        return;
      }

      // Hash the password using bcrypt before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate a unique account number for the user
      const accountNumber = this.generateAccountNumber();

      // Create a new user and associated account in the database
      const user = await User.create({
        username,
        password: hashedPassword,
      });

      const account = await Account.create({
        accountNumber,
        username,
        user: user._id,
      });

      // Display a success message with the registered account number
      this.cliView.displaySuccessMessage('register', `Account registered successfully\n\n Account Number: ${account.accountNumber}`);
    } catch (error) {
      console.log(error.message)
      this.cliView.displayFailedMessage('register', 'Failed to register the account. Please try again.');
    }
  }

  async login() {
    // Prompt the user to enter their username and password
    const username = this.cliView.getInput('Enter your username: ');
    const password = this.cliView.getPasswordInput('Enter your password: ');

    try {
      this.cliView.displayMessage('login', 'Logging in user...');

      // Find the user in the database based on the entered username
      const user = await User.findOne({ username });

      if (!user) {
        // Display a failed message if the account is not found
        this.cliView.displayFailedMessage('login', 'Account not found');
        return false; // Return false to indicate login failure
      }

      // Compare the entered password with the stored hashed password using bcrypt
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Display a success message and set the currentUserId
        this.cliView.displaySuccessMessage('login', 'Login successful!');
        this.currentUserId = user._id;

        return true; // Return true to indicate login success
      } else {
        // Display an error message for invalid credentials
        this.cliView.displayFailedMessage('login', 'Invalid credentials!');
        return false; // Return false to indicate login failure
      }
    } catch (error) {
      // Display a failed message if an error occurs during login
      this.cliView.displayFailedMessage('login', 'Failed to login. Please try again.');
      return false; // Return false to indicate login failure
    }
  }

  async depositMoney() {
    // Prompt the user to enter the amount to deposit
    const amount = parseFloat(this.cliView.getInput('Enter amount to deposit: '));

    this.cliView.displayMessage('deposit', `Depositing $${amount} to your account`)

    if (amount <= 0) {
      // Display an error message for invalid amount
      this.cliView.displayFailedMessage('deposit', 'Amount must be greater than zero');
      return;
    }

    try {
      // Find the account associated with the current user
      const account = await Account.findOne({ user: this.currentUserId });

      if (!account) {
        // Display an error message if the account is not found
        this.cliView.displayFailedMessage('deposit', 'Account not found!')
        return;
      }

      // Update the account balance by adding the deposited amount
      account.balance += amount;
      await account.save();

      // Display a success message for the deposit
      this.cliView.displaySuccessMessage('deposit', `Successfully deposited $${amount}`)
    } catch (error) {
      this.cliView.displayFailedMessage('deposit', 'Failed to deposit money. Please try again.');
    }
  }

  async withdrawMoney() {
    // Prompt the user to enter the amount to withdraw
    const amount = parseFloat(this.cliView.getInput('Enter amount to withdraw: '));

    this.cliView.displayMessage('withdraw', `Withdrawing $${amount} from your account`);
    
    if (amount <= 0) {
      // Display an error message for invalid amount
      this.cliView.displayFailedMessage('withdraw', 'Amount must be greater than zero')
    }

    try {
      // Find the account associated with the current user
      const account = await Account.findOne({ user: this.currentUserId });

      if (!account) {
        // Display an error message if the account is not found
        this.cliView.displayFailedMessage('withdraw', 'Account not found!');
        return;
      }

      if (account.balance >= amount) {
        // Update the account balance by deducting the withdrawn amount
        account.balance -= amount;
        await account.save();

        // Display a success message for the withdrawal
        this.cliView.displaySuccessMessage('withdraw', `Successfully withdrew $${amount}`)
      } else {
        // Display an error message for insufficient funds
        this.cliView.displayFailedMessage('withdraw', 'Insufficient funds!');
      }
    } catch (error) {
      this.cliView.displayFailedMessage('withdraw', 'Failed to withdraw money. Please try again.');
    }
  }

  async checkBalance() {
    try {
      this.cliView.displayMessage('balance', 'Checking account balance...')

      // Find the account associated with the current user
      const account = await Account.findOne({ user: this.currentUserId });

      if (!account) {
        // Display an error message if the account is not found
        this.cliView.displayFailedMessage('balance', 'Account not found!');
        return;
      }

      // Display the current account balance
      this.cliView.displaySuccessMessage('balance', `Current balance: $${account.balance}`);
    } catch (error) {
      this.cliView.displayFailedMessage('balance', 'Failed to check balance. Please try again.');
    }
  }

  async transferMoney() {
    // Prompt the user to enter the recipient's account number and the amount to transfer
    const recipient = this.cliView.getInput('Enter recipient account number: ');
    const amount = parseFloat(this.cliView.getInput('Enter amount to transfer: '));

    this.cliView.displayMessage('transfer', `Transferring $${amount} to ${recipient}`);

    try {
      // Find the sender's account associated with the current user
      const senderAccount = await Account.findOne({ user: this.currentUserId });

      if (!senderAccount) {
        // Display an error message if the sender's account is not found
        this.cliView.displayFailedMessage('transfer', 'Sender account not found!');
        return;
      }

      if (senderAccount.balance >= amount) {
        // Find the recipient's account based on the entered account number
        const recipientAccount = await Account.findOne({ accountNumber: recipient });

        if (!recipientAccount) {
          // Display an error message if the recipient's account is not found
          this.cliView.displayFailedMessage('transfer', 'Recipient account not found!');
          return;
        }

        // Update the account balances for both the sender and recipient
        senderAccount.balance -= amount;
        recipientAccount.balance += amount;

        await senderAccount.save();
        await recipientAccount.save();

        // Display a success message for the transfer
        this.cliView.displaySuccessMessage('transfer', `Successfully transferred $${amount} to account ${recipient}`);
      } else {
        // Display an error message for insufficient funds
        this.cliView.displayFailedMessage('transfer', 'Insufficient funds!');
      }
    } catch (error) {
      CLIView.displayMessage('Failed to transfer money. Please try again.');
    }
  }

  generateAccountNumber() {
    // Generate a unique account number based on the current date and random digits
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();

    return year + month + day + randomDigits;
  }
}

module.exports = Controller;