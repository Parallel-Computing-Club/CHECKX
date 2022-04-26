#include<iostream>
#include<vector>
#include<string>
#include<stack>
using namespace std;

class Solution {
public:
     bool canBeValid(string s, string l) {
         int n=s.size();
         if(n%2!=0){
             return false;
         }
         int e=0;
         int b=0;
         for(int i=0;i<n;i++){
             if(l[i]=='0'){
                 e++;
             }
             else{
                 b+=(s[i]=='(' ? 1 : -1);
                 if(b==-1){
                     b=0;
                     if(e==0){
                         return false;
                     }
                     else{
                         e++;
                     }
                 }
             }
         }
         e=0;
         b=0;
         for(int i=n-1;i>=0;i--){
             if(l[i]=='0'){
                 e++;
             }
             else{
                 b+=(s[i]==')' ? 1:-1);
                 if(b==-1){
                     b=0;
                     if(e==0){
                         return false;
                     }
                     else{
                         e--;
                     }
                 }
             }
         }
         return true;

    }
};
int main() 
{ 
    string s;
    cin>>s;
    string l;
    cin>>l;
    Solution ob;
    cout<<ob.canBeValid(s,l)<<endl;
} 