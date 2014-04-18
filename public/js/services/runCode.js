
realCodeEditor.factory('runCodeService', function($http){

	// run the program on server and return the results
	return {
		runCode: function(code){
			return $http.get('/api/run_code/'+ code);
		}
	}
});