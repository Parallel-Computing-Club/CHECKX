#include<iostream>
#include<vector>
#include<string>
#include<stack>
using namespace std;

class Solution {
    public:
        bool canBeValid(string s, string l) {
        stack<int>st;
        int n=s.size();
        if(n%2!=0){
            return false;
        }
        for(int i=0;i<n;i++){
            if(s[i]==')'&&!st.empty()&&s[st.top()]=='('){
                st.pop();
                continue;
            }
            else{
                st.push(i);
            }
        }
        if(st.size()%2!=0){
            return false;
        }
        while(!st.empty()){
            char a=s[st.top()];
            int i=st.top();
            st.pop();
            char b=s[st.top()];
            int j=st.top();
            if(a==b){
                if(a=='('){
                    if(l[i]!='0'||l[j]!='0'){
                        return false;
                    }
                }
                else{
                     if(l[j]!='0'){
                        return false;
                    }
                }
            }
            else{
                if(l[j]!='0'){
                    return false;
                }
            }
            st.pop();
        }
        return true;
    }
};
int main() {
    
    string s;
    cin>>s;
    string l;
    cin>>l;
    Solution ob;
    cout<<ob.canBeValid(s,l)<<endl;
} 