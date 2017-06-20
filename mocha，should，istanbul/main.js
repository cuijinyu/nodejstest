var  fibonacci=function(n)
{
	if(n===0)
	{
		return 0
	}else if(n===1)
	{
		return 1
	}else
	{
		return fibonacci(n-1)+fibonacci(n-2);
	}
};
if(require.main===module){
	//如果是直接执行main.js 则进入此处
	//如果main.js 被其他文件require，则此处不被执行
	var n=Number(process.argv[2]);
	console.log(`fibonacci(${n})is,`,fibonacci(n))
};
exports.fibonacci=fibonacci;
