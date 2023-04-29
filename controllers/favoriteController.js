import { Favorite, Article } from "../models/index.js";

export const addFavorite = async(request, response) => {
    
    const { articleId } = request.body;

    // verify the user has not created this favorite before
    const favorite = await Favorite.findOne({
        where: {
            articleId: articleId
        }
    });

    if(favorite != null){
        return response.redirect('/favorites/my-favorites');
    }

    // add favorite
    const newFavorite = new Favorite();

    newFavorite.articleId = articleId;
    newFavorite.userId = request.user.id;

    await newFavorite.save();

    return response.redirect('/favorites/my-favorites');

}

export const myFavorites = async(request, response) => {
    
    const { page } = request.query;

    const limit = 6;
    const offset = limit*(page == undefined ? 0 : page);

    const [favorites, totalElements] = await Promise.all([
        Favorite.findAll({
            where: {
                userId: request.user.id
            },
            limit: limit,
            offset: offset,
            include: [
                {model: Article, as: 'article'}
            ]
        }),
        Favorite.count({
            where: {
                userId: request.user.id
            }
        })
    ]);

    let isContent = false;

    if(totalElements > 0){
        isContent = true;
    }

    const totalPages = Math.ceil(totalElements/limit);

    return response.render('favorites/my_favorites',{
        user: request.user,
        page: 'My Favorites',
        csrfToken: request.csrfToken(),
        favorites: favorites,
        totalPages: totalPages,
        currentPage: (page == undefined ? 0 : page),
        isContent: isContent
    })

}

export const removeFavorite = async(request, response) => {

    const { favoriteId } = request.body;

    // verify favorite exists
    const favorite = await Favorite.findByPk(favoriteId);

    if(favorite == null){
        return response.redirect('/favorites/my-favorites');
    }

    // validate permissions
    if(favorite.userId.toString() != request.user.id.toString()){
        return response.redirect('/');
    }

    // remove favorite
    favorite.destroy();

    return response.redirect('/favorites/my-favorites');

}