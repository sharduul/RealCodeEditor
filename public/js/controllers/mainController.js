
realCodeEditor.controller('mainController', 

	function mainController($scope, runCodeService){

		// initialize the variables
		//$scope.code = "";
		$scope.output = "";
		
		
		
		// function to run code
		$scope.runCode = function(){
		
			$scope.output = ""; // initialize the output box
			//var code = document.getElementById("sharetext").value; // get value of text area actually
			
			
			var editor = ace.edit("sharetext");
			var code = editor.getSession().getValue();
			
			//console.log(code);
		
			// encode to escape the special characters
			return runCodeService.runCode(escape(code))
				.success(function(data) {
					$scope.output = data.output_text;
				});
		
		};
		
});