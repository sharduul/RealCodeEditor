
realCodeEditor.controller('mainController', 

	function mainController($scope, runCodeService){

		$scope.code = "";
		$scope.output = "";
		
		
		$scope.runCode = function(){
		
			$scope.output = ""; // initialize the output box
		
			// encode to escape the special characters
			return runCodeService.runCode(escape($scope.code))
				.success(function(data) {
					$scope.output = data.output_text;
				});
		
		};
		
});