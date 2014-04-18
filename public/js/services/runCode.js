
realCodeEditor.factory('runCodeService', function($http){

	return {
		runCode: function(code){
			return $http.get('/api/run_code/'+ code);
		}
	}
});