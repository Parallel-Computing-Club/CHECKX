#include<iostream>
#include<vector>
#include<cstring>
#include<stack>
#include<algorithm>
using namespace std;

class Solution {
public:
    string makeGood(string s) {
        stack<int>st;
        int n=s.size();
        for(int i=0;i<n;i++){
            if(st.size()==0){
                  st.push(s[i]);
            }
            else{
                if(abs(s[i]-st.top())==32){
                    if(s[i]>='A'&&s[i]<='Z'||char(st.top())>='A'&&char(st.top())<='z'){
                         st.pop();
                    }
                 }
                 else{
                     st.push(s[i]);
                 }
            }
        }
        string ans="";
        while(!st.empty()){
            ans.push_back(char(st.top()));
            st.pop();
        }
        reverse(ans.begin(),ans.end());
        return ans;
    }
};

int main(){
    string s;
    cin>>s;
    Solution ob;
    cout<<ob.makeGood(s);
    return 0;
}


