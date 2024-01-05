# stock-app

# Description
This stock app is created by using React on the frontend and PHP and node.js for backend
This stock app is responsible for fecthing stocks from polygon api and then updating them randomly on basis of a set interval timeout


# Requirements for the app
- PHP
- Node.js
- React


# Steps to run the app
- Run composer install to install the php dependencies used to fire request to polygon api
- Run the backend.php file first which is used to fetch the data of stocks from the polyugon api ( php backend.php )
- Then run the node file so that after certain amount of time which is unique to each stock the price gets updated. ( node updateStock.js )
- First run npm install to make sure that the required dependencies are installed on your system ( npm install )
- Finally we execute the react file for the frontend use ( npm start )
- Also make sure that the stock_data.json file is already created so that the file gets updated with the data


# Screenshots 

![image](https://github.com/Archinxua/stock-app/assets/55922867/b2c06e33-28b1-4412-a2b9-3fbb9336e1fa)

![image](https://github.com/Archinxua/stock-app/assets/55922867/59749c86-77b6-4d89-9642-739206db7c78)
