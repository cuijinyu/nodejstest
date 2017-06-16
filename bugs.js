var express=require("express");
var superagent=require("superagent");
var cheerio=require("cheerio");
var app=express();

app.get("/",(req,res,next)=>{
	superagent.get('https://cnodejs.org/')
	.end((err,sres)=>{
		if(err)
		{
			return next(err);
		}
		else
		{
			//console.log(sres.text)
			var $=cheerio.load(sres.text);
			//console.log($)
			var items=[];
			$("#topic_list .topic_title").each((idx,element)=>{
				var element=$(element);
				//console.log(element);
				items.push({
					title:element.attr("title"),
					href:element.attr("href")
				})
			});
			$(".user_avatar img").each((idx,element)=>{
				var element=$(element);
				//console.log(element.attr("title"));
				items[idx].author=element.attr("title");
			})
		}
		console.log(items);
		res.send(items);
	})
})
app.listen(3000,(req,res)=>{
	console.log("app is running on port:3000");
})