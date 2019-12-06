

class Controller{
    static getPage(req, res){
        return res.status(200, __dirname + '/views/index.html');
    }
}