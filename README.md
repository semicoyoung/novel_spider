# novel_spider

- novel_spider项目，获取小说数据，插入数据库

## 生产task：produce.js

- 小说网站的小说有分类，如：历史小说，军事小说，科幻小说等，每个分类有一个页面URL，页面包含最新更新的小说，获取最新更新的小说的书名，书ID，章节名，章节ID，作者名，等信息，新建一条task数据，status为pending，插入到task表中。

- task

	- book_id
	- book_name
	- author_name
	- chapter_id
	- chapter_name
	- chapter_title
	- tag
	- status: pending
	- created_at
	- updated_at	


## 消费task：consumer.js

- consumer从task表中读取task记录，获取小说数据，插入到相关表

	- 在task表中，查找一条 status = ‘pending’的记录，找到后，更新其status=‘running’，

	- author: 爬取一下信息，新插入一条作者的记录到author表

		- author_name: 作者名称
	
	- book：爬取一下信息，新插入一条书的记录到book表
		- book_id： 书的ID
		- book_name：书名
		- book_introduction：书的简介 
		- book_image_url： 书封面的图片URL
		- author_id： 作者ID
		- tag: 书的类型标签

	- director: 爬取整本书的目录，插入新更新的目录

		- book_id
		- book_name
		- chapter_id: 章节ID
		- chapter_title： 章节名称
	- chapter： 用在director中获得的新更新的目录，到具体的章节的页面，获取以下信息，插入记录到chapter表中

		- chapter_id： 章节ID
		- chapter_title： 章节名称
		- content: 章节内容

	- 完成以上操作后，更新status=‘success，
	- 如果中途操作出错，则抛出错误，状态更新为’failed‘
	- 事务补偿机制：定期检查task表，status=’running‘的创建时间和更新时间间隔太长的记录以及status=’failed‘的记录，需要更新为’pending‘，重新跑
		
