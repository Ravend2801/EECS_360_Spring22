
for(var k = 1; k <= 100; k++)
{
    if(k % 3 == 0 )
    {
        console.log("Divisible by 3");
    }
    else if(k % 7 == 0){
        console.log("Divisible by 7");
    }
    else if(k%3==0 && k%7==0){
        console.log("Divisible by both 3 and 7");
    }
    else{
        console.log(k);
    }
}
