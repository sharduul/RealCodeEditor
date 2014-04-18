
realCodeEditor.controller('mainController', 

	function mainController($scope, runCodeService){

		// initialize the variables
		$scope.code = "";
		$scope.output = "";
		
		// function to run code
		$scope.runCode = function(){
		
			$scope.output = ""; // initialize the output box
		
			// encode to escape the special characters
			return runCodeService.runCode(escape($scope.code))
				.success(function(data) {
					$scope.output = data.output_text;
				});
		
		};
		
});