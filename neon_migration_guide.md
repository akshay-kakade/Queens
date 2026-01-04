# Migration Guide: Switching to Neon PostgreSQL

Follow these steps to move from local SQLite development to a production-ready **Neon.tech** database.

## Step 1: Create a Neon Database
1. Go to [Neon.tech](https://neon.tech/) and sign up for a free account.
2. Create a new project named `queens-club`.
3. In the Dashboard, find the **Connection Details** section.
4. Ensure the language is set to **"PostgreSQL"** and copy the connection string. It will look like this:
   `postgresql://owner:password@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require`

---

## Step 2: Configure Environment Variables
You need to tell Flask to use the new URL instead of `site.db`.

1. Open your `backend/.env` file.
2. Add or update the `DATABASE_URL` line:
   ```env
   DATABASE_URL=postgresql://owner:password@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
   *(Note: For some hosting platforms like Render, you might need to change `postgresql://` to `postgres://` if only the latter is accepted.)*

---

## Step 3: Install PostgreSQL Adapter
SQLite is built into Python, but PostgreSQL requires a library called `psycopg2`.

1. Run this in your backend terminal:
   ```bash
   pip install psycopg2-binary
   ```
2. (I have already added this to your `requirements.txt` for production).

---

## Step 4: Initialize the Online Database
Since your Neon database is empty, you need to create the tables there.

1. In your backend terminal (with the `.env` updated), run:
   ```bash
   flask db upgrade
   ```
   *This will look at your `migrations` folder and build all tables (Users, Tenants, Orders, etc.) on Neon.*

---

## Step 5: Verify & Create Admin
1. Once the tables are created, your shop will have 0 users.
2. Run your admin creation script to set up your first online admin:
   ```bash
   python create_admin_account.py
   ```

## Summary of Changes Needed in Hosting (Render/Railway)
When you upload your code to a hosting platform (like Render), you must add the `DATABASE_URL` to their **"Environment Variables"** settings page. Flask will automatically prioritize that URL over the local one.
