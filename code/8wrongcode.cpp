#include<iostream>
#include<vector>
#include<cstring>
#include<stack>
#include<algorithm>
#include<unordered_map>
using namespace std;

class Solution {
public:
    bool backspaceCompare(string s, string t) {
        stack<char>st;
        int n=s.size();
        for(int i=0;i<n;i++){
            if(st.empty()){
                st.push(s[i]);
                continue;
            }
            if(s[i]=='#'){
                st.pop();
                continue;
            }
            st.push(s[i]);
        }
        string ans1="";
        while(!st.empty()){
            ans1.push_back(st.top());
            st.pop();
        }
        int m=t.size();
        for(int i=0;i<m;i++){
            if(st.empty()){
                if(t[i]=='#'){
                    continue;
                }
                st.push(t[i]);
                continue;
            }
            if(t[i]=='#'){
                st.pop();
                continue;
            }
            st.push(t[i]);
        }
        string ans2="";
        while(!st.empty()){
            ans2.push_back(st.top());
            st.pop();
        }
        if(ans1==ans2){
            return true;
        }
        return false;
    }
};

int main(){
    Solution ob;
    string s;
    string t;
    cin>>s;
    cin>>t;
    cout<<ob.backspaceCompare(s,t);  
}