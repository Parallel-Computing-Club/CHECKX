#include<iostream>
#include<vector>
#include<string>
#include<stack>
using namespace std;


class Solution
{
    public:
    bool ispar(string x)
    {
        stack<int> s;
        int i=0;
        while(i<x.size()){
            if(x[i]=='('||x[i]=='{'||x[i]=='['){
                if(x[i]=='('){
                    s.push(-1);
                }
                if(x[i]=='['){
                    s.push(0);
                }
                if(x[i]=='{'){
                    s.push(1);
                }
            }
            else{
                if(s.size()==0){
                    return false;
                }
                else{
                    if(x[i]==')'&&s.top()!=-1){
                        return false;
                    }
                    if(x[i]==']'&&s.top()!=0){
                        return false;
                    }
                    if(x[i]=='}'&&s.top()!=1){
                        return false;
                    }
                    s.pop();
                }
            }
            i++;
        }
        if(s.empty()){
            return true;
        }
        return false;
    }

};


int main()
{
   string a;
       cin>>a;
       Solution obj;
       if(obj.ispar(a))
        cout<<"balanced"<<endl;
       else
        cout<<"not balanced"<<endl;
}