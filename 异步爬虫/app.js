var eventproxy=require("eventproxy");
var superagent=require("superagent");
var cheerio=require("cheerio");
var url=require("url");
var ep=new eventproxy();
//新建一个eventproxy实
var cnodeUrl="https://cnodejs.org";
superagent.get(cnodeUrl)
			.end((err,res)=>
			{
				var topicUrls=[];
				if(err){
					return console.log(err);
				}
				var $=cheerio.load(res.text);
				//获取首页所有连接
				$("#topic_list .topic_title").each((idx,element)=>
				{
					var $element=$(element);
					var href=url.resolve(cnodeUrl,$element.attr("href"));
					topicUrls.push(href);
				});
				console.log(topicUrls);
				ep.after("topic_html",topicUrls.length,(topics)=>{
				topics=topics.map((topicPair)=>{
					var topicUrl=topicPair[0];
					var topicHtml=topicPair[1];
					var $=cheerio.load(topicHtml);
					return({
						title:$(".topic_full_title").text().trim(),
						href:topicUrl,
						comment1:$(".reply_content").eq(0).text().trim(),
						author:$(".user_name .dark").text(),
						score1:$(".floor .big").text().replace("积分: ","")
					})
				})	
				console.log("final:");
				console.log(topics);
			});
			topicUrls.forEach((topicUrl)=>
				{
					superagent.get(topicUrl)
						.end((err,res)=>
						{
							console.log(`fetch ${topicUrl} successful`);
							ep.emit("topic_html",[topicUrl,res.text]);
						})
				})
		})
