
export const blockAuthUsers = async(request, response, next) => {

    const token = request.cookies._token;

    if(token == null){
        return next();
    }else{
        return response.redirect('/');
    }
}
