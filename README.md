## Getting Started
Setting up the database:
First, make sure you have XAMPP on your computer. You can download it from this link https://www.apachefriends.org/download.html. After installing it you need to open XAMPP Control and start Apache and MySQL services. After the services start succesfully you can open PHPMyAdmin tab in your browser by clicking the button Admin in the MySQL row. Nextly find backnend/timedb.sql in Files, download it and then open PHPMyAdmin, in the top bar find button named "Import", click on it, scroll down and you should find button "Import". Import the timedb.sql file into PHPMyAdmin. After completing these steps your database should be hosted on your local network.

Setting up the project environment:
Run this following command after you opened the project folder
```bash
npm install
```

Running the server:
To run the server in terminal you have to execute following commands
```bash
cd time-planner/backend

node server.js
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
