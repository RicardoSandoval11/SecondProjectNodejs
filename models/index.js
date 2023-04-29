import { Article } from "./Article.js";
import { Category } from "./Category.js";
import { Comment } from "./Comment.js";
import { Favorite } from "./Favorite.js";
import { User } from "./User.js";
import { Videogame } from "./Videogame.js";

// Videogame relationships
Videogame.belongsTo(Category,{foreignKey: 'categoryId', onDelete: 'CASCADE'});
Videogame.belongsTo(User, {foreignKey: 'userId', onDelete: 'CASCADE'});

// Articles relationship
Article.belongsTo(Videogame, {foreignKey: 'videogameId', onDelete: 'CASCADE'});
Article.belongsTo(User,{foreignKey: 'userId', onDelete: 'CASCADE'});

// Comments relationships
Comment.belongsTo(Article,{foreignKey: 'articleId',onDelete: 'CASCADE'});
Comment.belongsTo(User,{foreignKey: 'userId',onDelete: 'CASCADE'});

// Favorites relationships
Favorite.belongsTo(Article,{foreignKey: 'articleId',onDelete: 'CASCADE'});
Favorite.belongsTo(User,{foreignKey: 'userId', onDelete: 'CASCADE'});

// reverse relationships
Category.hasMany(Videogame,{foreignKey: 'categoryId'});
Videogame.hasMany(Article,{foreignKey: 'videogameId'});
Article.hasMany(Comment,{foreignKey: 'articleId'});
Article.hasMany(Favorite,{foreignKey: 'articleId'});

export {
    Article,
    Videogame,
    Comment,
    Favorite,
    Category
}