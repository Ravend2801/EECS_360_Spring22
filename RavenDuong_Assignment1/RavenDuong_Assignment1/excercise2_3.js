let size; 
function grid(n_size)
{
    size = n_size;
    let grid = "";
    for(let i = 1; i <= size; i++)
    {
        for(let k=1; k <= size; k++)
        {
            if((i+k)%2==0)
            {
                grid += " ";
            }
            else{
                grid += "*";
            }
        }
        grid += "\n";
    }
    console.log("size = " + size);
    console.log(grid);
}
grid(6);
grid(12);