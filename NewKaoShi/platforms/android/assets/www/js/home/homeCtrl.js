homeModule
	.controller('HomeCtrl', ['$scope','$rootScope', 'HomeServ', 
	function($scope,$rootScope, HomeServ) {
		$rootScope.isLogin=false;
		$scope.slideboxes = [{
			imgsrc: "img/123.jpg",
			linksrc: ''
		}, {
			imgsrc: "img/123.jpg",
			linksrc: ''
		}, {
			imgsrc: "img/123.jpg",
			linksrc: ''
		}]
		$scope.selectindex = 0;
		$scope.SelectItem = SelectItem;

		function SelectItem(index) {
			$scope.selectindex = index;
		}
		$scope.itemlist = [{
			type: 0, //0表示全科，1表示单科
			Img: 'img/ben.png',
			Name: '一级建造师(全科+三门公共课)',
			Descript: ' 送VIP+全套环球视频',
			Price: '99'
		}, {
			type: 0, //0表示全科
			Img: 'img/ben.png',
			Name: '一级建造师(全科+三门公共课)',
			Descript: ' 送VIP+全套环球视频',
			Price: '99'
		}, {
			type: 1, //0表示全科
			Img: 'img/ben.png',
			Name: '一级建造师(单科+三门公共课)',
			Descript: ' 送VIP+全套环球视频',
			Price: '99'
		}, {
			type: 1, //0表示全科
			Img: 'img/ben.png',
			Name: '一级建造师(单科+三门公共课)',
			Descript: ' 送VIP+全套环球视频',
			Price: '99'
		}, {
			type: 0, //0表示全科
			Img: 'img/ben.png',
			Name: '一级建造师(全科+三门公共课)',
			Descript: ' 送VIP+全套环球视频',
			Price: '99'
		}]
		$scope.vipitem={
			type: 0, //0表示全科
			Img: 'img/ben.png',
			Name: '一级建造师(全科+三门公共课)',
			Descript: ' 送VIP+全套环球视频',
			Price: '99'
		}
	}])