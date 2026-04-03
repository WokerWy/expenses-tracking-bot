# Expenses Tracking

Telegram Bot for tracking expenses and incomes in Google Spreadsheet.

Supports different categories, accounts, and multiple users. Easy to deploy and configure on Vercel.
Supports *Italian* and *English* (feel free to make a PR to support other languages).

#### Additional Features
- **/lookup** – Retrieve information about your expenses and incomes, filtering by category, account, and time range.
- **/monthly_stats** – View your monthly expenses and income statistics.
- **/accounts** – Check your account balances.

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDomenicoCardillo%2Fexpenses-tracking&env=NODE_ENV,PORT,SENTRY_DNS,ALLOWED_GROUP_IDS,ALLOWED_CHAT_IDS,SHEET_DB_ID,SHEET_DB_NAME,GOOGLE_PRIVATE_KEY,GOOGLE_SERVICE_ACCOUNT_EMAIL,BOT_TOKEN&project-name=expenses-tracking-bot)

## 🔹 Setup Instructions

### 1️⃣ Create Your Telegram Bot & Generate a Token
1. [Create your Telegram bot](https://core.telegram.org/bots/tutorial#obtain-your-bot-token).
2. Generate and save the bot token.
3. [Add commands to your bot](https://core.telegram.org/bots/tutorial#creating-your-command) by copying them from `command.txt` in your preferred language.
4. [Get your chat ID](https://stackoverflow.com/a/72649378) – you’ll need it for the next steps.


### 2️⃣ Create a Google Service Account
1. [Create a Google Service Account](https://cloud.google.com/iam/docs/service-accounts-create?hl=it#creating).
2. Once created, go to its details and generate a new key:
   - Navigate to the **"Keys"** tab.
   - Click **"Add Key" > "Create New Key"**.
   - Choose **JSON** and click **Create**.
3. A JSON file will be downloaded. Extract:
   - `private_key` → Add to `GOOGLE_PRIVATE_KEY` env variable
   - `client_email` → Add to `GOOGLE_SERVICE_ACCOUNT_EMAIL` env variable

### 3️⃣ Create a Google Spreadsheet for Your Database
1. Duplicate this [spreadsheet](https://docs.google.com/spreadsheets/d/1Zj1h2n2WKjqGinwwyP95C5lf21pC17hA2tV2qMZtL7o/edit?usp=sharing).
2. Share it with your **Google Service Account email** and grant **read & write** permissions.
3. Save your spreadsheet id, you can get it from the Google Sheet URL, https://docs.google.com/spreadsheets/d/{SHEET_DB_ID}/edit

#### 📌 Spreadsheet Breakdown:
- **DB** – Stores all transactions. (Remove test entries)
- **{CHAT_ID}_ACCOUNTS** – ***Required step*** – Replace `{CHAT_ID}` with your actual chat ID (e.g., `12345678_ACCOUNTS`). Each user can have a custom account sheet.
- **EXPENSE_CATEGORIES** – Edit and add your expense categories.
- **INCOME_CATEGORIES** – Edit and add your income categories.
- **USERS** – ***Required step*** – List users and their respective chat IDs.
- **CONFIGURATIONS** – Settings for validation.
- **EXTRA_CATEGORIES** – Used for transfers and balance updates.  
  **Make sure to edit labels to match your language.**

### 4️⃣ [Optional] Create Sentry project
1. Create Sentry project (and account if you don't have one)
2. Get your project DSN by going into Sentry Project setting > Client Keys [DSN]

## ⚙️ Environment Variables  
Add the following environment variables to Vercel:

| Variable                        | Required | Description                                                                                         |
|---------------------------------|----------|-----------------------------------------------------------------------------------------------------|
| `NODE_ENV`                      | ✅       | Set to `production` or `development`                                                                |
| `PORT`                          | ✅       | Port for the bot server                                                                             |
| `SENTRY_DNS`                    | ❌       | [Optional] Sentry DSN for error tracking                                                            |
| `ALLOWED_GROUP_IDS`             | ✅       | JSON array of allowed group chat IDs                                                                |
| `ALLOWED_CHAT_IDS`              | ✅       | JSON array of allowed user chat IDs                                                                 |
| `SHEET_DB_ID`                   | ✅       | Spreadsheet ID (found in the Google Sheets URL)                                                     |
| `SHEET_DB_NAME`                 | ✅       | Name of the Google Spreadsheet                                                                      |
| `GOOGLE_PRIVATE_KEY`            | ✅       | Private key from your Google Service Account JSON                                                   |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL`  | ✅       | Google Service Account email                                                                        |
| `BOT_TOKEN`                     | ✅       | Telegram Bot Token                                                                                  |

## 📅 Set Webhook
After deploying the bot, set the webhook using the following URL:

```
https://api.telegram.org/bot<bot_token>/setWebhook?url=<webhook_url>/bot
```

- **bot_token**: Telegram Bot Token.
- **webhook_url**: Your Vercel app URL.

To verify the webhook, check:

```
https://api.telegram.org/bot<bot_token>/getWebhookInfo
```

*If you set the webhook incorrectly, you can delete it with:*
```
https://api.telegram.org/bot<bot_token>/deleteWebhook
```

## APIs

***TBD: APIs are only a DRAFT and not tested.***

#### Authentication is handled by [Supabase](https://supabase.com/):

Additional environment variables needed:
- `SUPABASE_JWT_SECRET` **[REQUIRED]**: Supabase JWT Secret.
- `SUPABASE_VALID_TOKEN_SUBS` **[REQUIRED]**: Valid token subs.

## Run Locally
Clone the project and navigate to the project directory.

#### Install dependencies  
```
npm install
```

Clone .env.dist to .env, and add your local environment variables.

#### Build & Watch
```
npm run build:watch
```

#### Serve
Open a second terminal and run:
```
npm run build:serve
```

## TODOs:
- /delete_last command, to delete the last inserted row (if date is today)

## FAQs
#### Why Use Google Sheets as a Database?
I can access all my data from any device, even offline, add entries directly to the sheets when I'm home, create pivot tables for deeper insights, and customize the interface to suit my needs—all without maintaining a custom UI.
