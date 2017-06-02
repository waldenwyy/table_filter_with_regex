
var ww = ww || {};
ww.models_filter = {};
$(document).ready(function(){
    ww.models_filter.init();
});
ww.models_filter.init = function(){
  $(document).click(ww.models_filter.close);
  $(".models-search_initial .dropdown").click(ww.models_filter.toggle);
  ww.models_filter.default();
  $(".models-search_initial .dropdown-link").click(ww.models_filter.select);
  $(".models-search_initial .filter-reset").click(ww.models_filter.reset);
};

ww.models_filter.toggle = function(event){
  event.stopPropagation();
  var droplist = $(".models-search_initial .dropdown-list");
  var thislist = $(this).children(".dropdown-list");
  droplist.not(thislist).removeClass("models_active");
  thislist.toggleClass("models_active");
};



ww.models_filter.close = function(event){
  var droplist = $(".models-search_initial .dropdown-list");
  droplist.removeClass("models_active");
};
ww.models_filter.default = function(){
   
   $(".models-search_initial input").each(function(){
       $(this).val($(this).parent().find("a").eq(0).text());
       $(this).attr("data-id","");
    })
   $(".filter-reset").hide();
}

ww.models_filter.select = function(event){
  event.preventDefault();
  event.stopPropagation();
  var item = $(this).text();
  var item_id = $(this).attr("data-id");
  var item_id_array = [];
  var topinput = $(this).parents().eq(3).find("input");

  // 2 variables for contain and not contain for regex
  var filter_is = ""; 
  var filter_not = "";

  topinput.val(item);
  topinput.attr('data-id' , item_id);

  //an array to store all data-id
  $(".models-search_initial .dropdown input").each(function(){
      item_id_array.push($(this).attr("data-id"));  
  })

  //put 2 types of values into 2 variables for regex
  for(i = 0; i < item_id_array.length; i++){
    if(item_id_array[i] !== ""){
        if(item_id_array[i].indexOf("^") > -1){
            filter_not += item_id_array[i].replace("^","");
        }else{
            filter_is += "(?=.*"+item_id_array[i]+")";
            //shapeshift contains value
        }
    }
  }
  
  //shapeshift not contains value
  if(filter_not !== ""){
    filter_not = "^[^"+filter_not+"]*$"
  }
  
  //regex that have 2 types of shapeshifted values so it looks like (?=.*H)(?=.*R)^[^FC]*$
  var filter_rex = new RegExp(filter_is+filter_not, "g");
  
  //test product titles and hide or show row
  //add and remove new classes to override default css
  var product_title = $("#models_table .table-body__row span[data-th='models']")
  var product_count = 0;
  product_title.parent().removeClass("new_filter_first new_filter_even new_filter_style");
  product_title.each(function(){
      if (filter_rex.test($(this).text()) == false){
          $(this).parent().hide();
      }else{
          product_count ++;
          $(this).parent().show().addClass("new_filter_style");
          if(product_count == 1){
              $(this).parent().show().addClass("new_filter_first");
          }else if(product_count % 2 == 0){
              $(this).parent().show().addClass("new_filter_even");
          }
      }
  })
  //console.log(product_count);
  var row_length = $("#models_table .table-body__row").length;
  if (product_count !== row_length) {
    $(".filter-reset").show();
  }else{
    $(".filter-reset").hide();
  }
  ww.models_filter.close();
}
ww.models_filter.reset = function(event){
    event.preventDefault();
    var product_row = $("#models_table li")
    product_row.show().removeClass("new_filter_first new_filter_even new_filter_style");
    ww.models_filter.default();
}