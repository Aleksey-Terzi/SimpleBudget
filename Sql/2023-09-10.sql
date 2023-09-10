create table dbo.Product (
    ProductId int not null identity
    ,AccountId int not null
    ,CategoryId int
    ,Name nvarchar(100) not null

    ,constraint PK_Product primary key (ProductId)
)
go

create unique index UQ_Product on Product (AccountId, Name)
go

create table dbo.ProductPrice (
    ProductPriceId int not null identity
    ,ProductId int not null
	,PaymentId int
    ,CompanyId int
    ,CategoryId int
    ,PriceDate datetime not null
    ,Price money not null
    ,IsDiscount bit not null
	,Quantity int 
    ,Description nvarchar(100)
    ,CreatedOn datetime not null
    ,CreatedByUserId int not null
    ,ModifiedOn datetime not null
    ,ModifiedByUserId int not null

    ,constraint PK_ProductPrice primary key (ProductPriceId)
)
go