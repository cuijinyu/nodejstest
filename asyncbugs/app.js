var express=require("express");
var cheerio=require("cheerio");
var superagent=require("superagent");
var async=require("async");
var url=require("url");
var app=express();

var desc=[];
var topicUrls=[];
var count=[];

var fetchUrl=function(url,callback)
{
	count++;
	superagent.get(url)
				.end(function(err,res)
				{
					var $=cheerio.load(res.text);
					desc.push({
						title:$(".topic_full_title").text().trim(),
						href:url,
						comment1:$(".reply_content").eq(0).text().trim(),
						author:$(".user_name .dark").text(),
						score1:$(".floor .big").text().replace("积分: ","")
					})
					//console.log(desc);
				})
	count--;
}
superagent.get("https://cnodejs.org/")
			.end(function(err,res)
			{
				if(err)
				{
					console.log(err);
				}
				//console.log(res.text);
				var $=cheerio.load(res.text);
				$("#topic_list .topic_title").each(function(idx,element)
				{
					var $element=$(element);
					var href=url.resolve("https://cnodejs.org/",$element.attr("href"));
					topicUrls.push(href);
				});
				async.mapLimit(topicUrls,5,function(url,callback)
					{
						fetchUrl(url,callback);
						//console.log(count);
					},function(){
						//console.log(desc);
						//console.log(topicUrls);
					});
			})
		setTimeout(()=>
		{console.log(desc);
		console.log(topicUrls);},5000);//异步输出测试结果
