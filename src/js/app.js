document.addEventListener('DOMContentLoaded', () => {
    const removeBtns = document.querySelectorAll('.remove-btn');

    const boxDialog = document.querySelector('#box-dialog');
    const boxDialogTitle = document.querySelector('#box-dialog-title');
    const boxDialogContent = document.querySelector('#box-dialog-content');
    const closeDialogBtn = document.querySelector('#close-btn');
    const body = document.querySelector('#bg-dark');
    // remove article
    const removeArticleForm = document.querySelector('.remove-article-form');

    const openDialog = (event) => {

        const articleinformation = event.target.id.split('_');
        boxDialogTitle.innerHTML = `Remove article ${articleinformation[0]}`;
        boxDialogContent.innerHTML = `Once you have deleted the article '${articleinformation[0]}', you will not be able to get it back.`
        removeArticleForm.id = articleinformation[1];
        boxDialog.classList.add('animate__fadeIn');
        boxDialog.classList.remove('hidden');
        body.classList.remove('hidden');

    }

    removeBtns.forEach((btn) => {
        btn.addEventListener('click', openDialog);
    });

    const handleCloseBoxDialog = () => {
        boxDialog.classList.add('hidden');
        body.classList.add('hidden');
    }

    closeDialogBtn.addEventListener('click', handleCloseBoxDialog);

    const removeArticle = (event) => {
        const action = `/articles/remove/${event.target.id}`;
        removeArticleForm.setAttribute('action', action);
    }

    removeArticleForm.addEventListener('submit', removeArticle);

});