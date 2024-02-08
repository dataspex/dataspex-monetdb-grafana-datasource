drop procedure if exists fill_dataset;
drop table if exists dataset;

create table dataset (thistime timestamptz, value float);

create procedure fill_dataset()
begin
    declare step integer;
    declare nextstep interval second;
    declare endtime timestamptz;
    set endtime = now();
    set step = 3600;
    while (step > 0) do
        set nextstep = cast(cast(step as varchar(5)) as interval second);
        insert into dataset values ( endtime - nextstep, rand() / 10000000 );
        set step = step - 1;
    end while;
end;

call fill_dataset();
