// JS program to create and test Group class
class Group{
    //constructor to initialize an empty Group
    constructor()
    {
        //internally Group is represented by array of its elements 
        // create an empty array
        this.elements = [];
    }
    //method that returns true if value is present in Droup else return false
    has(value)
    {
        // loop over the elements array
       for(var i=0;i<this.elements.length;i++)
        {
            if(this.elements[i] === value) // value present, return true
                return true;
        }
        return false; // value not present
    }
     // method to add value to the Group
    add(value)
    {
        // value is not present in the Group
        if(!this.has(value))
            this.elements.push(value); // add value to the at of the elements array
    }
  
    // method to delete value from the Group
    delete(value)
    {
        // loop over the elements array
        for(var i=0;i<this.elements.length;i++)
        {
            if(this.elements[i] === value) // value found in array at index i
            {
                // replace the element at index i with the last element of the array
                this.elements[i] = this.elements[this.elements.length-1];
                this.elements.pop(); // delete the last element of the array
            }
        }
    }
  
    // method to perform union of this Group and otherGroup and return the resultant Group
    union(otherGroup)
    {
  
        // create an empty Group to store the union
        let unionGroup = new Group();
      
        // loop to add elements of this group to unionGroup using add method
        for(var i=0;i<this.elements.length;i++)
            unionGroup.add(this.elements[i]);
      
        // loop to add elements of otherGroup to unionGroup using add method
        for(var i=0;i<otherGroup.elements.length;i++)
            unionGroup.add(otherGroup.elements[i]);
      
        return unionGroup;
    }
  
    // method to perform intersection of this Group and otherGroup and return the resultant Group
    intersection(otherGroup)
    {
        // create an empty Group to store the intersection
        let intersectionGroup = new Group();
      
        // loop over the elements of this Group
        for(var i=0;i<this.elements.length;i++)
        {  
            // element at index i of this Group is present in otherGroup, then add ith element of this group to intersectionGroup
            if(otherGroup.has(this.elements[i]))
                intersectionGroup.add(this.elements[i]);
        }

        return intersectionGroup;
    }
  
    // method to perform difference of this Group and otherGroup and return the resultant Group
    difference(otherGroup)
    {
        // create an empty Group to store the difference
        let differenceGroup = new Group();
      
        // loop over the elements of this Group
        for(var i=0;i<this.elements.length;i++)
        {
            // ith element is not present in otherGroup, then add ith element of this Group to differenceGroup
            if(!otherGroup.has(this.elements[i]))
                differenceGroup.add(this.elements[i]);
        }
      
        return differenceGroup;
   }
} //end of Group class

//test the class
let group1 = new Group();
let group2 = new Group();
group1.add(1);
group1.add(2);
group1.add(3);
console.log(group1);
group2.add(2);
group2.add(3);
group2.add(5);
group2.add(2);
console.log(group2);
console.log(group1.has(5));
console.log(group2.has(3));
console.log(group1.union(group2));
console.log(group1.intersection(group2));
console.log(group1.difference(group2));
group1.delete(1);
console.log(group1);
group2.delete(1);
console.log(group2);