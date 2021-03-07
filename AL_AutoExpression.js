function AL_AutoExpression(){

	//USES OPENHARMONY

	// VARIABLES 
	
	var DOC = $.scn ;
	var INPUT_COLUMN = "";
	var OUTPUT_COLUMN ="";	
	var EXPRESSION_COLUMN = "";
	var CYCLE= 360;
	var LENGTH= 10;
	var avaible_columns = [];
	var avaible_attributes = [];
	
	// EXECUTIONS
	
	MessageLog.trace('test');
	
	var avaible_columns = filter_columns_by_type(fetch_columns(DOC.selectedNodes),["3DPATH","BEZIER","EASE","QUATERNIONPATH"]);
	
	var avaible_attributes = get_attributes_and_nodes(DOC.selectedNodes);
	
	var select_column_list = []
	var select_attribute_list = []
	
	for(var n = 0 ; n < avaible_columns.length; n++){ 
	
		select_column_list.push(avaible_columns[n].node+" --> "+avaible_columns[n].display_name);
	
	}
	
	for(var a = 0 ; a < avaible_attributes .length; a++){ 
	
		select_attribute_list.push(avaible_attributes[a].node+" --> "+avaible_attributes[a].name);
	
	}	
	
	
	InputDialog ()
	


	// FUNCTIONS 
	

	function InputDialog (){
		
		//MessageLog.trace(arguments.callee.name)
	    var d = new Dialog
	    d.title = "MODULO MASTER";
	    d.width = 100;

		var INPUT = new ComboBox();
		 INPUT.label = "INPUT  : ";
		 INPUT.editable = true;
		 INPUT.itemList = select_column_list;
		d.add(INPUT);

		var OUTPUT = new ComboBox();
		 OUTPUT.label = "OUTPUT  : ";
		 OUTPUT.editable = true;
		 OUTPUT.itemList = select_attribute_list;
		d.add(OUTPUT);
		
		
		
		if ( d.exec() ){	
		
			var selected_column_index = select_column_list.indexOf(INPUT.currentItem);
			var selected_attr_index = select_attribute_list.indexOf(OUTPUT.currentItem);
		
			var INPUT_COLUMN = avaible_columns[selected_column_index];
	
			var OUTPUT_ATTRIBUTE = avaible_attributes[selected_attr_index];
			
			MessageLog.trace("INPUT_COLUMN");
			MessageLog.trace(INPUT_COLUMN.display);
			MessageLog.trace("OUTPUT_ATTRIBUTE");
			MessageLog.trace(OUTPUT_ATTRIBUTE.node);
			MessageLog.trace(OUTPUT_ATTRIBUTE.name);
			MessageLog.trace(avaible_columns);
			MessageLog.trace(avaible_attributes);
	
			
			var EXPRESSION_COLUMN = create_expression();
			var exp_text = generate_modulo_exp(INPUT_COLUMN.name,CYCLE,LENGTH)
			set_exp_text(EXPRESSION_COLUMN,exp_text)

			node.linkAttr(OUTPUT_ATTRIBUTE.node, OUTPUT_ATTRIBUTE.name, EXPRESSION_COLUMN);

			

		}
		
	}
	
	
	function link_bezier(){
		
		
		
	}
	

	function link_to_attribute(_attr){
		
		
		
	}
	
	function generate_modulo_exp(_inputcolum, _cycle,_length){
		
		//exmeple (value(column("WR"))%360)/41.789
		var expression = '( value(column( "'+_inputcolum+'" )) % '+_cycle+' ) / '+_length;
		
		return expression;

		
	}
	
	function set_exp_text(_exp,_text){
		
		column.setTextOfExpr(_exp,_text);

	}
	
	function fetch_columns(nodes_list){
		
		var columns_list = Array();
		
		for(var n = 0 ; n < nodes_list.length; n++){ 
		
			var currentNode = nodes_list[n];
			
			var linked_columns = get_linked_columns(currentNode);
			
			if(linked_columns.length >0){
				columns_list = columns_list.concat(linked_columns);
			}
		}
		
		
		return unique_array(columns_list); 
		
	}		
		
	function create_expression(){
		
		var serial = Math.floor(Math.random()*10000000);
		var column_name = "EX_"+serial
		column.add(column_name,"EXPR")
		column.update();
		return column_name;
		
	}		
	function get_linked_columns(_node){
		
		var node_columns = Array();
	
		var attrList = getAttributesNameList (_node);
		
		for (var i=0; i<attrList.length; i++){
			
			var attribute_name = attrList[i]
			
			var linked_column = node.linkedColumn(_node,attribute_name)
			
			
			if( linked_column !=""){
				
				var linked_column_name = column.getDisplayName(linked_column);
				
				MessageLog.trace(attribute_name);
				MessageLog.trace(linked_column);
				MessageLog.trace(linked_column_name);

				//node_columns.push(linked_column_name);
				var C = {node:_node,name:linked_column,display_name:linked_column_name}
				node_columns.push(C);
			}
			
		}
		
		return node_columns;
		
		
	}
	
	function unique_array(arr){
		
		var unique_array = Array();
		for(var i = 0 ; i<arr.length;i++){
			if(unique_array.indexOf(arr[i])==-1){
				unique_array.push(arr[i]);
			}
		}
		return unique_array;
		
	}
	
	function get_attributes_and_nodes(nodes_list){
		
		var attributes_and_nodes = []
		
		for(var n = 0 ; n < nodes_list.length; n++){ 
		
			var currentNode = nodes_list[n];	
			var attr_list = getAttributesNameList(currentNode);
			
			for (var i=0; i<attr_list.length; i++){	
			
				var attr = node.getAttr(currentNode, 1, attr_list[i]);
				var attr_type = attr.typeName();
				
				if(attr_type  == "DOUBLE" || attr_type  == "DOUBLEVB" ){
					
					var AN = {node:currentNode,name:attr_list[i]};
					
					MessageLog.trace(attr_type)
					
					attributes_and_nodes.push(AN);				
					
				}
				
			}
		}
		
		return attributes_and_nodes;
	}
	
	function getAttributesNameList (snode){
		
		//MessageLog.trace(arguments.callee.name)
		
		var attrList = node.getAttrList(snode, frame.current(),"");
		var name_list= Array();
		
		for (var i=0; i<attrList.length; i++){	

			var attr = attrList[i];
			var a_name = attr.keyword();
			var sub_attr = attr.getSubAttributes()
			name_list.push(a_name);

			if(sub_attr.length > 0){
				for (var j=0; j<sub_attr.length; j++){	
					attrList.push(sub_attr[j]);
					var sub_attr_name = sub_attr[j].fullKeyword()
					name_list.push(sub_attr_name);
				}
			}
			
		}
		
		//MessageLog.trace(name_list)
		
		return name_list;
		
	}
	function filter_columns_by_type (column_list,relevant_types){
		
		//MessageLog.trace(arguments.callee.name)
		
		var filtered_list = Array();
		
		for(var i = 0 ; i<column_list.length;i++){
			
				if(relevant_types.indexOf(column.type(column_list[i].name))!=-1){
					
					filtered_list.push(column_list[i])
					
					//MessageLog.trace(column.type(column_list[i]));
					
				}
		}
		
		return filtered_list;
	}
	


}
