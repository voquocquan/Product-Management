module.exports = (objectPagination, query, countProducts) => {
    if(query.page){

        objectPagination.curentPage = parseInt(query.page);
    }
    objectPagination.skip = (objectPagination.curentPage - 1) * objectPagination.limitItem;
    
    const totalPage = Math.ceil(countProducts / objectPagination.limitItem);
    objectPagination.totalPage = totalPage;

    return objectPagination;
}