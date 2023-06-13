# Banking CLI App

The Banking CLI App is a command-line interface application that allows users to register, login, and perform banking operations such as depositing money, withdrawing money, checking balance, and transferring money between accounts.

## Features

- User Registration: Users can create an account by providing a username and password.
- User Login: Registered users can log in to their accounts using their username and password.
- Deposit Money: Logged-in users can deposit a specified amount of money into their account.
- Withdraw Money: Logged-in users can withdraw a specified amount of money from their account.
- Check Balance: Logged-in users can check the current balance of their account.
- Transfer Money: Logged-in users can transfer a specified amount of money from their account to another account.

## Prerequisites

- Node.js and npm installed on your system.
- MongoDB database connection details.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/banking-cli-app.git
   ```

````

2. Navigate to the project directory:

```bash
    cd banking-cli-app
````

```
    cd banking-cli-app
```

3. Install the dependencies:

```bash
    npm install
```

4. Configure the MongoDB connection:

- Open the config/db.js file.
- Replace the MongoDB connection URL with your own database connection URL.

5. Start the application:

```bash
    node index.js
```

## Usage

Upon running the application, you will see a menu with different options. You can select an option by entering the corresponding number and pressing Enter.

- Register: Choose option 1 to register a new user. Enter a username and password when prompted.
- Login: Choose option 2 to log in with an existing user account. Enter your username and password when prompted.
- Deposit Money: Choose option 3 to deposit money into your account. Enter the amount you want to deposit.
- Withdraw Money: Choose option 4 to withdraw money from your account. Enter the amount you want to withdraw.
- Check Balance: Choose option 5 to check the current balance of your account.
- Transfer Money: Choose option 6 to transfer money from your account to another account. Enter the recipient's account number and the amount to transfer.

## Contributing

Contributions to the project are welcome! If you find any issues or would like to suggest improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit/).
