create table dbo.Account (
	AccountId int identity not null,
	Name varchar(100) not null,
    
    constraint PK_Account primary key (AccountId)
)

create table dbo.Category(
	CategoryId int identity not null,
	AccountId int not null,
	Name nvarchar(50),

    constraint PK_Category primary key (CategoryId)
)

create table dbo.Company(
	CompanyId int identity not null,
	AccountId int not null,
	Name nvarchar(100),
 
    constraint PK_Company primary key (CompanyId)
)

create table dbo.Currency(
	CurrencyId int identity not null,
	AccountId int not null,
	Code varchar(10) not null,
	ValueFormat nvarchar(50) not null,
    
    constraint PK_Currency primary key (CurrencyId)
)

create table dbo.CurrencyRate(
	CurrencyRateId int identity not null,
	CurrencyId int not null,
	StartDate datetime not null,
	Rate money not null,
	BankOfCanada bit not null,
    constraint PK_CurrencyRate primary key (CurrencyRateId)
)

create table dbo.Payment(
	PaymentId int identity not null,
	WalletId int not null,
	CategoryId int,
	CompanyId int,
	PersonId int,
	PaymentDate datetime not null,
	Value money not null,
	Description nvarchar(100),
	CreatedOn datetime not null,
	CreatedByUserId int not null,
	ModifiedOn datetime not null,
	ModifiedByUserId int not null,
	Taxable bit not null,
	ParentPaymentId int,
	TaxYear int,
 
    constraint PK_Payment primary key (PaymentId)
)

create table dbo.Person(
	PersonId int identity not null,
	AccountId int not null,
	Name nvarchar(50) not null,
 
    constraint PK_Person primary key (PersonId)
)

create table dbo.PlanPayment(
	PlanPaymentId int identity not null,
	WalletId int not null,
	CategoryId int,
	CompanyId int,
	PersonId int,
	PaymentStartDate datetime not null,
	PaymentEndDate datetime,
	Value money not null,
	Description nvarchar(100),
	Taxable bit not null,
	TaxYear int,
	IsActive bit not null,
	CreatedOn datetime not null,
	CreatedByUserId int not null,
	ModifiedOn datetime not null,
	ModifiedByUserId int not null,
 
    constraint PK_PlanPayment primary key (PlanPaymentId)
)

create table dbo.TaxRate(
	TaxRateId int identity not null,
	AccountId int not null,
	Name varchar(50) not null,
	PeriodYear int not null,
	Rate money not null,
	MaxAmount money not null,
 
    constraint PK_TaxRate primary key (TaxRateId)
)

create table dbo.TaxSetting(
	TaxSettingId int identity not null,
	AccountId int not null,
	Name varchar(50) not null,
	PeriodYear int not null,
	Value money not null,
    
    constraint PK_TaxSetting primary key (TaxSettingId)
)

create table dbo.TaxYear(
	[Year] int not null,
	PersonId int not null,
	FinalTaxAmount money not null,
	Closed datetime not null,
 
    constraint PK_TaxYear primary key ([Year], PersonId)
)

create table dbo.[User] (
	UserId int identity not null,
	Name nvarchar(50) not null,
	Password nvarchar(50) not null,
    
    constraint PK_User primary key (UserId)
)

create table dbo.Wallet(
	WalletId int identity not null,
	AccountId int not null,
	PersonId int,
	CurrencyId int not null,
	Name nvarchar(50) not null,
    
    constraint PK_Wallet primary key (WalletId)
)

go