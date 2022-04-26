#include<iostream>
#include<vector>
#include<cstring>
#include<stack>
#include<algorithm>
using namespace std;

class Solution {
public:
    bool checkValidString(string s) {
        stack<int>open;
        stack<int>star;
        int n=s.size();
        for(int i=0;i<n;i++){
            if(s[i]=='('){
                open.push(i);
            }
            else if(s[i]=='*'){
                star.push(i);
            }
            else{
                if(!open.empty()){
                    open.pop();
                }
                else if(!star.empty()){
                    star.pop();
                }
                else{
                    return false;
                }
            }
        }
        while(!open.empty()){
            if(star.empty()){
                return false;
            }
            else if(open.top()<star.top()){
                open.pop();
                star.pop();
            }
            else{
                return false;
            }
        }
        
        return true;
    }
};

int main(){
    string s;
    cin>>s;
    Solution ob;
    cout<<ob.checkValidString(s);
    return 0;
}


