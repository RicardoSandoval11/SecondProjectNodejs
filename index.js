import express from 'express';
import dotenv from 'dotenv';
import csrf from 'csurf';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { db } from './config/database.js';

// routes
import articleRoutes from './routes/articleRoutes.js';
import AuthenticationRoutes from './routes/authenticationRoutes.js';
import CategoriesRoutes from './routes/categoriesRoutes.js';
import CommentsRoute from './routes/commentRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import filterRoutes from './routes/filterRoutes.js';
import userRoutes from './routes/userRoutes.js';
import videogameRoutes from './routes/videogamesRoutes.js';


dotenv.config({path: '.env'});


const app = express();

// Enable body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Enable CSRF
app.use(cookieParser());
app.use(csrf({ 
            cookie: true,
            headerName: 'csrf-token' 
        }));

// Database conection
try {
    await db.authenticate();
    db.sync();
} catch (error) {
    console.log(error);
}

// enable pug
app.set('view engine', 'pug');
app.set('views' ,'./views');

// routes
app.use('/auth', AuthenticationRoutes);
app.use('/articles', articleRoutes);
app.use('/categories',CategoriesRoutes);
app.use('/comments', CommentsRoute);
app.use('', homeRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/filter', filterRoutes);
app.use('/user', userRoutes);
app.use('/videogames', videogameRoutes);

// static files
app.use(express.static('public'));

app.listen(3000);

