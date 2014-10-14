/**
 * Created by fengxiaoping on 10/14/14.
 */

AV.initialize("xv1cgfapsn90hyy2a42i9q6jg7phbfmdpt1404li6n93tt2r", "70sp4h8prccxzyfp56vwm9ksczji36bsrjvtwzvrzegfza67");

var WeeklyRank = AV.Object.extend('WeeklyRank'),
    Product = AV.Object.extend('Product'),
    ProductDetail = AV.Object.extend('ProductDetail'),
    ProductState = AV.Object.extend('ProductState');

angular.module('drillerApp', [])
    .controller('ProdListController', ['$scope', function ($scope) {
        var query = new AV.Query(WeeklyRank),
            products = [];
        query.include('product');

        query.find().then(function (weeklyRanks) {
            _.each(weeklyRanks, function (weeklyRank) {
                var product = weeklyRank.get('product').toJSON();
                console.log('%s,%s',
                    product.name,
                    JSON.stringify(product));
                products.push(product);
            })
            return AV.Promise.as(products);
        }).then(function (products) {
            var promises = [];
            _.each(products, function (product) {
                var q = new AV.Query(ProductDetail);
                q.equalTo('product', new Product({
                    id: product.objectId
                }));
                console.log('query detail,%s', JSON.stringify(product));
                var promise = q.first();
                promise.then(function (detail) {
                    if (detail) {
                        console.log('details,%s', JSON.stringify(detail.toJSON()))
                        product.description = detail.get('description');
                    }
                })
                promises.push(q.first());
            })
            return AV.Promise.when(promises);
        }).then(function () {
            _.each(products, function (product) {
                product.screenshot = 'http://api.page2images.com/directlink?p2i_url=' + product.website + '&p2i_key=de9ebb14cee6e38e';
                var p2i = new page2images();
                p2i.thumbnail('screenshot_' + product.id);
                product.techrank = Math.random() * 10;
            })

            $scope.$apply(function () {
                $scope.products = products;
            })
        })

//        $scope.products = [
//            {
//                name: "echo 回声",
//                description: ""
//            },
//            {
//                name: "看台 FM",
//                description: ""
//            },
//            {
//                name: "灵感",
//                description: ""
//            },
//            {
//                name: "慕课网",
//                description: ""
//            },
//            {
//                name: "宠物说",
//                description: ""
//            },
//            {
//                name: "Berdict",
//                description: ""
//            }
//        ]
    }]);
