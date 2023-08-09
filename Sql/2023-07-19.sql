create table dbo.ImportPayment (
	ImportPaymentCode varchar(100) not null,
    AccountId int not null,
	CategoryId int,
	CompanyId int,
	CreatedOn datetime not null,
	CreatedByUserId int not null,
	ModifiedOn datetime not null,
	ModifiedByUserId int not null,
 
    constraint PK_ImportPayment primary key (ImportPaymentCode)
)