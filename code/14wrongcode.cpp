#include<iostream>
#include<stack>
#include<vector>
#include<cstring>

using namespace std;

class Solution {
public:
    int trap(vector<int>& h) {
        stack<int>s;
        int n=h.size();
        vector<int>t(h.size(),-1);
        for(int i=0;i<n;i++){
            if(s.empty()){
                s.push(i);
            }
            else{
                if(h[i]>=h[s.top()]){
                    while((!s.empty())&&h[i]>=h[s.top()]){
                        t[s.top()]=i;
                        s.pop();
                    }
                }
                s.push(i);
            }
        }
        while(!s.empty()){
            t[s.top()]=-1;
            s.pop();
        }
        int maxm=-1;
        int curr=0;
        for(int i=0;i<n;i++){
            int j=i+1;
            for(;j<t[i];j++){
                curr+=abs(h[i]-h[j]);
            }
            i=j-1;
        }
        return curr;
    }
};

int main(){
    Solution ob;
    int n;
    cin>>n;
    vector<int>v;
    for(int i=0;i<n;i++){
        int k;
        cin>>k;
        v.push_back(k);
    }
    cout<<ob.trap(v);
}