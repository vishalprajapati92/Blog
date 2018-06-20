
var arrForUser = [];
var arrForPost = [];
var arrForComment = [];
var firstPromise,secondPromise,thirdPromise;
// console.log(localStorage.getItem("dataForPost"));
if(localStorage.getItem("dataForPost") != null && localStorage.getItem("dataForComment") != null && localStorage.getItem("dataForUser") != null)
{
    $("#btn_getData").hide(); 
    // console.log("local storage");
    displayData(); 
}
else
{
    $("#btn_getData").show();  
}

jQuery(document).on('click','#btn_getData',function()
{
     firstPromise = new Promise(function(resolve, reject)
     {
        $.ajax({
            type:"GET",
            url : "https://jsonplaceholder.typicode.com/users",
            success : function(data)
            {
                resolve(data);
            },
            error : function(error)
            {
                reject(error);
            }
        });
        
      });
    
    secondPromise = new Promise(function(resolve, reject)
 {
         $.ajax({
                type:"GET",
                url : "https://jsonplaceholder.typicode.com/posts",
                success : function(data)
                {
                    resolve(data);
                },
                error : function(error)
                {
                    reject(error);
                }
            });
            
        });
    
    thirdPromise = new Promise(function(resolve, reject)
        {
            $.ajax({
                type:"GET",
                url : "https://jsonplaceholder.typicode.com/comments",
                success : function(data)
                {
                    resolve(data);
                },
                error : function(error)
                {
                    reject(error);
                }
            });
            
        });

    Promise.all([firstPromise, secondPromise, thirdPromise]).then(function(data) {    
       
        if(data[0] != null)
        {
            for(let i=0;i<data[0].length; i++)
            {
                // console.log(typeof(data[i]["id"]));
                var entryForUser = {
                    "u_id" : data[0][i]["id"],
                     "name" : data[0][i]["name"]
                 }

                //  console.log(entryForUser);
               arrForUser.push(entryForUser);                 
            }
            localStorage.setItem("dataForUser",JSON.stringify(arrForUser));   
        }
        if(data[1] != null)
        {
            // console.log(data[1]);
            for(let i=0;i<data[1].length; i++)
                    {
                        var objPost = {
                            "userId": data[1][i]["userId"],
                            "id": data[1][i]["id"],
                            "title": data[1][i]["title"],
                            "body": data[1][i]["body"],
                            "isLike" : false,
                         }
                        arrForPost.push(objPost);
                    }
                    localStorage.setItem("dataForPost",JSON.stringify(arrForPost));
        }
        if(data[2] != null)
        {
            for(let i=0;i<data[2].length; i++)
            {
                 arrForComment[i] = data[2][i];
            }
            localStorage.setItem("dataForComment",JSON.stringify(arrForComment)); 
        }
        if(data[0] != null && data[1] != null && data[2] != null )
        {
            $("#btn_getData").hide(); 
            displayData();
        }
      });
});




function displayData()
{
    // $("#btn_getData").hide();
    arrForPost = JSON.parse(localStorage.getItem("dataForPost"));
    arrForComment = JSON.parse(localStorage.getItem("dataForComment"));
    arrForUser = JSON.parse(localStorage.getItem("dataForUser"));

    // console.log("array length"+arrForPost);

    for(var j=0; j<arrForPost.length; j++)
    {
        for(var i=0; i<arrForUser.length; i++)
        { 
            if(arrForPost[j].userId == arrForUser[i].u_id)
            {
                jQuery('body').append(`
                <div id="post_id_${j}">
                    <h1> ${arrForUser[i].name}</h1>
                    <h2> ${arrForPost[j].title} </h2>
                    <p> ${arrForPost[j].body} </p>
                    <input type="button" id="like_id_${j}" value="like">
                    <input type="button" id="comment_id_${j}" value="comment">
                    <input type="button" id="Delete_id_${j}" value="Delete">
                </div>
                `); 
                if(arrForPost[j]["isLike"] == true)
                {
                     $('#like_id_'+j).val("Liked")
                }  
            }        
         }
    }  
}

jQuery(document).on('click', 'input[id^="comment_id_"]',function()
{ 
    // txtcomment
    var strComment_id = jQuery(this).attr('id');
    var strPostCommentId = strComment_id.replace("comment_id_","post_id_");
    // console.log("strPostCommentId = "+strPostCommentId);
    var strValueCommnetId = strPostCommentId.replace("post_id_","");
    var intValueCommnetId = parseInt(strPostCommentId.replace("post_id_",""));
    intValueCommnetId += 1;      
        for(var i=0; i<arrForComment.length; i++)
        {
            if(intValueCommnetId == arrForComment[i]["postId"])
            {
                // console.log($('#pComment_id_'+strValueCommnetId).attr('id'));
                if($('#pComment_id_'+i).attr('id') != undefined)
                {
                    $('#pComment_id_'+i).remove();
                }
                else
                {
                    // console.log("value ="+$('#pComment_id_'+strValueCommnetId).attr('id'));
                    $('div#post_id_'+strValueCommnetId).after(`
                    <p id="pComment_id_${i}">${arrForComment[i]["body"]}</p>
                        `);
                }
            }
        }
        //Check add comment is available or not 
        // console.log("button id ="+ $('#btn_comment_id_'+strValueCommnetId).attr("id"));
        if($('#btn_comment_id_'+strValueCommnetId).attr("id") != undefined)
        {
            $("#txtcomment").remove();
            $('#btn_comment_id_'+strValueCommnetId).remove();
        }
        else
        {
            $('div#post_id_'+strValueCommnetId).after(`
            <input type="text" id="txtcomment" placeholder="Please enter comment..." />
            <input type="button" id="btn_comment_id_${strValueCommnetId}" value="Add"/>
             `); 
        }
});

//click button add comment 
jQuery(document).on('click', 'input[id^="btn_comment_id_"]',function()
{
    var strBtnComemnt_id = jQuery(this).attr('id');
    var intValueId = parseInt(strBtnComemnt_id.replace("btn_comment_id_",""));
    var strValueId = strBtnComemnt_id.replace("btn_comment_id_","");
    intValueId += 1;

    var entryForCommnet = {
        "postId" : intValueId,
        "body" : $('#txtcomment').val()
    };
    arrForComment.push(entryForCommnet);
    $('p[id^="pComment_id_"]').remove();
    for(var i=0; i<arrForComment.length; i++)
    {
        if(intValueId == arrForComment[i]["postId"])
        {
            if($('#pComment_id_'+i).attr('id') != undefined)
            {
                $('#pComment_id_'+i).remove();
            }
            else
            {
                $('div#post_id_'+strValueId).after(`
                <p id="pComment_id_${i}">${arrForComment[i]["body"]}</p>
                    `);
            }
        }
    }
    localStorage.removeItem("dataForComment");
    localStorage.setItem("dataForComment",JSON.stringify(arrForComment));
    $('#txtcomment').val('');
});


jQuery(document).on('click', 'input[id^="Delete_id_"]',function()
{    
    var strDelete_id = jQuery(this).attr('id');
    var strDivDeleteId = strDelete_id.replace("Delete_id_","post_id_");
    var intValueId = parseInt(strDivDeleteId.replace("post_id_",""));
    // console.log("intValueId"+intValueId);
    $('#txtcomment').remove();
    $('#btn_comment_id_'+intValueId).remove(); 
    $('p[id^="pComment_id_"]').remove(); 
    localStorage.removeItem("dataForPost");
    localStorage.removeItem("dataForComment");
    localStorage.removeItem("dataForUser");
    for(let a=0; a<arrForComment.length; a++)
    {
        console.log("id of post array "+arrForPost[intValueId]["id"]);
        console.log("id of comment array "+arrForComment[a]["postId"]);

        if(arrForPost[intValueId]["id"] == arrForComment[a]["postId"])
        {
            arrForComment.splice(a,1);
        } 
    }
    arrForPost.splice(intValueId,1);
    // arrForUser.splice(intValueId,1);

    localStorage.setItem("dataForPost",JSON.stringify(arrForPost));
    localStorage.setItem("dataForComment",JSON.stringify(arrForComment));
    localStorage.setItem("dataForUser",JSON.stringify(arrForUser));

    $('div[id^="post_id_"]').remove();
    $('p[id^="pComment_id_"]').remove();
    displayData();
});

jQuery(document).on('click', 'input[id^="like_id_"]',function()
{
    var strLikePost = jQuery(this).attr('id');
    // console.log(strLikePost);
    var strDivDeleteId = strLikePost.replace("Delete_id_","post_id_");
    var intValueId = parseInt(strLikePost.replace("like_id_",""));
    $('#txtcomment').remove();
    $('#btn_comment_id_'+intValueId).remove();  
    $('p[id^="pComment_id_"]').remove();
    // console.log(arrForPost[intValueId]["isLike"]);
    if(arrForPost[intValueId]["isLike"] == false)
    {
        arrForPost[intValueId]["isLike"] = true; 
         $('#'+strLikePost).val('Liked')
    }
    else
    {
        $('#'+strLikePost).val('Liked')
    }
    localStorage.removeItem("dataForPost");
    localStorage.setItem("dataForPost",JSON.stringify(arrForPost));
});
