var express=require ('express');
var router =express.Router();
var sql=require ('mssql');
var MongoClient = require('mongodb').MongoClient;

var conn=require('../dbconnection/connect');

var routes=function(){

    router.route('/api/userlogin')
.post(function(req,res)
{
    MongoClient.connect(conn.mongodbconnecturl(),{
        useNewUrlParser: true,
      }, function(err, client) {
        var db = client.db('AbcBank'); 
        const query={"LoginId":req.body.LoginId,"Passowrd":req.body.Passowrd};
        db.collection('LoginDetail', function (err, collection) {
            console.log('--------------',req.body);
            collection.findOne(query,function(err, items) {
                if(err) { return console.dir(err); }
                else{  
                    const innerquery={"userName": req.body.LoginId};
                    db.collection('AccountDetails', function (err, collection) {
                        collection.findOne(innerquery,function(err, items) {
                            if(err) { return console.dir(err); }
                            else{    
                            res.status(200).send(items);         
                            }
                        });
                    });
                    //res.status(200).send(items);
                }
           });
       });
    });
});

router.route('/api/loginprocess')
.post(function(req,res)
{
    MongoClient.connect(conn.mongodbconnecturl(),{
        useNewUrlParser: true,
      }, function(err, client) {
        var db = client.db('AbcBank'); 
        const query={"LoginId":req.body.LoginId,"Passowrd":req.body.Passowrd};
        db.collection('LoginDetail', function (err, collection) {
        
            console.log('--------------',req.body);
            collection.findOne(query,function(err, items) {
                if(err) { return console.dir(err); }   
                res.status(200).send(items);
           });
       });
    });
});

router.route('/api/viewaccount')
.post(function(req,res)
{
    MongoClient.connect(conn.mongodbconnecturl(),{
        useNewUrlParser: true,
      }, function(err, client) {
        var db = client.db('AbcBank'); 
        console.log('--------------',req.body);

        const query={"CustomerId": req.body.CustomerId,"AccountNumber":req.body.AccountNumber};
        db.collection('AccountDetail', function (err, collection) {
        
            collection.findOne(query,function(err, items) {
                if(err) { return console.dir(err); }    
                res.status(200).send(items);         
           });
       });
    });
});

router.route('/api/createaccount')
.post(function(req,res)
{
    MongoClient.connect(conn.mongodbconnecturl(),{
        useNewUrlParser: true,
      }, function(err, client) {
        var db = client.db('AbcBank'); 
        db.collection('AccountDetail', function (err, collection) {
        
            console.log('--------------',req.body);
            collection.insertOne(
                { 
                    "CustomerId" : req.body.CustomerId, 
                    "AccountNumber" : req.body.AccountNumber, 
                    "AccountType" : req.body.AccountType,  
                    "AccOpeningDate" :req.body.AccOpeningDate, 
                    "AccBalance" : req.body.AccBalance, 
                    "Branch" :req.body.Branch
                },function(err, result) {
                    if (err) throw err;
                    console.log("Document inserted");
                    res.status(200).send(result);
                });
       });
    });
});

router.route('/api/updateaccount')
.put(function(req,res)
{
    MongoClient.connect(conn.mongodbconnecturl(),{
        useNewUrlParser: true,
      }, function(err, client) {
        var db = client.db('AbcBank'); 
        db.collection('AccountDetail', function (err, collection) {
        
            console.log('--------------',req.body);
            var myquery = { CustomerId: req.body.CustomerId };
            var newvalues = { 
                $set:{ 
                    "CustomerId" : req.body.CustomerId, 
                    "AccountNumber" : req.body.AccountNumber, 
                    "AccountType" : req.body.AccountType,  
                    "AccOpeningDate" :req.body.AccOpeningDate, 
                    "AccBalance" : req.body.AccBalance, 
                    "Branch" :req.body.Branch
            
                }
            };
            collection.updateOne(myquery,newvalues,function(err, result) {
                    if (err) throw err;
                    console.log("Update account sucessfully.");
                    res.status(200).send(result);
                });
       });
    });
});



router.route('/api/addcustomerinfo')
.post(function(req,res)
{
    MongoClient.connect(conn.mongodbconnecturl(),{
        useNewUrlParser: true,
      }, function(err, client) {
        var db = client.db('AbcBank'); 
        db.collection('CustomerInformation', function (err, collection) {
        
            console.log('--------------',req.body);
            collection.insertOne(
                { 
                    "CustomerId":req.body.CustomerId,
                    "CustFirstName":req.body.CustFirstName,
                    "CustMiddleName":req.body.CustMiddleName,
                    "CustLastName":req.body.CustLastName,
                    "CustDOB":req.body.CustDOB,
                    "CustAddress1":req.body.CustAddress1,
                    "CustAddress2" :req.body.CustAddress2,
                    "CustCity":req.body.CustCity,
                    "CustStage":req.body.CustStage,
                    "CustCountry":req.body.CustCountry,
                    "CustContact":req.body.CustContact,
                    "CustEmailId": req.body.CustEmailId
                },function(err, result) {
                    if (err) throw err;
                    console.log("Customer info inserted");
                    res.status(200).send(result);
                });
       });
    });
});

router.route('/api/viewministatement')
.post(function(req,res)
{
    MongoClient.connect(conn.mongodbconnecturl(),{
        useNewUrlParser: true,
      }, function(err, client) {
        var db = client.db('AbcBank'); 
        console.log('--------------',req.body);

        const query={"CustomerId": req.body.CustomerId,"AccountNumber":req.body.AccountNumber};
        db.collection('AccountTransactionDetail', function (err, collection) {
            var mysort = {"LastTransDate":-1};
            collection.find(query).sort(mysort).limit(3).toArray(function(err, items) {
                if(err) { return console.dir(err); }    
                res.status(200).send(items);         
           });
           
       });
    });
});


router.route('/')
.get(function(req,res)
{
    conn.connect().then(function ()
    {
        var req=new sql.Request(conn);
        var sqlQuery="select  * from [User]";// where [Enterpriseid]='"+req.params.Name +"'";
        console.log(sqlQuery);

        req.query(sqlQuery).then(function(recordset){
            res.json(recordset.recordset);
            conn.close();

        })
        .catch(function(err){
            conn.close();
            res.status(400).send('Select Query Error:-'+ err);
        })
    })
    .catch(function(err){
        conn.close();
        res.status(400).send(err);
    })

});


router.route('/api/adduser')
        .post(function (req, res) {
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    
                    console.log(req.body);

                    var query = "INSERT INTO [user] (Enterpriseid) VALUES ('"+req.body.Enterpriseid +"')";
                    
                    console.log(query);

                    request.query(query).then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).send(req.body);
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while inserting data 1:-"+ err);
                        });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while inserting data 2:-"+ err);
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while inserting data 3:-"+ err);
                });
            }).catch(function (err) {
                conn.close();
                res.status(400).send("Error while inserting data 4:-"+ err);
            });
        });

        router.route('/api/updateuser/:Name')
        .put(function (req, res) {
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    
                    console.log(req.body);

                    var query = "UPDATE [user] SET Enterpriseid= '" + req.body.Enterpriseid  +  "' , Shift=  '" + req.body.Shift + "'  WHERE Enterpriseid= '" + req.params.Name+"'";

                    console.log(query);

                    request.query(query).then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).send(req.body);
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while inserting data 1:-"+ err);
                        });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while inserting data 2:-"+ err);
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while inserting data 3:-"+ err);
                });
            }).catch(function (err) {
                conn.close();
                res.status(400).send("Error while inserting data 4:-"+ err);
            });
        });


 return router;
};

module.exports=routes;