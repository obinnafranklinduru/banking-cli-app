const CLIView = require('./view/cli.view');
const connectDB = require('./config/db');
const Controller = require('./controller/controller');

class Application {
  constructor() {
    // Instantiate a new controller for handling user actions
    this.controller = new Controller();

    // Instantiate a new CLIView for displaying messages and getting user input
    this.cliView = new CLIView();
  }
  async run() {
    try {
      this.cliView.displayMessage('loading', 'Connecting to the database...');

      // Connect to the database and display success or failure messages
      await new Promise((resolve, reject) => {
        connectDB()
          .then(() => {
            this.cliView.displaySuccessMessage('loading', 'Database connected');
            resolve();
          })
          .catch((error) => {
            this.cliView.displayFailedMessage('loading', 'Database connection failed');
            reject(error);
          });
      });

      console.log('\nWelcome to the OBINNA Banking Application!\n');

      let isLoggedIn = false;
      let isNotLoggedIn = true

      while (true) {
        let choice = "";

        if (isLoggedIn) {
          // Display menu options for logged-in users
          choice = this.cliView.getInput(
            '\nPlease select an option:\n3. Deposit Money\n4. Withdraw Money\n5. Check Balance\n6. Transfer Money\n0. Exit\n'
          );
        } else {
          // Display menu options for users who are not logged in
          choice = this.cliView.getInput(
            'Please select an option:\n1. Register\n2. Login\n0. Exit\n'
          );
        }

        switch (choice) {
          case '1':
            if (isNotLoggedIn) {
              await this.controller.register(); // handle user registration
            }
            break;
          case '2':
            if (isNotLoggedIn) {
              isLoggedIn = await this.controller.login(); // handle user login
              isLoggedIn ? isNotLoggedIn = false : isNotLoggedIn = true;
            }
            break;
          case '3':
            if (isLoggedIn) {
              await this.controller.depositMoney(); // handle money deposit
            }
            break;
          case '4':
            if (isLoggedIn) {
              await this.controller.withdrawMoney(); // handle money withdrawal
            }
            break;
          case '5':
            if (isLoggedIn) {
              await this.controller.checkBalance(); // display the account balance
            }
            break;
          case '6':
            if (isLoggedIn) {
              await this.controller.transferMoney(); // handle money transfer
            }
            break;
          case '0':
            console.log('Thank you for Banking with Us!');
            process.exit(0); // Exit the application
          default:
            console.log('Invalid choice. Please try again.');
        }
      }
    } catch (error) {
      // console.log(error.message);
      console.log('\nAn unexpected error occurred. Please try again later.');
      process.exit(1); // Exit the application with an error code
    }
  }
}

const app = new Application();
app.run(); // Start the application