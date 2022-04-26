#include<iostream>
#include<stack>
#include<vector>
#include<cstring>

using namespace std;

class Solution {
public:
    int trap(vector<int>& h) {
        int n=h.size();
        vector<int>maxl(n);
        vector<int>maxr(n);
        int m=h[0];
        for(int i=0;i<n;i++){
            m=max(m,h[i]);
            maxl[i]=m;
        }
        m=h[n-1];
        cout<<endl;
        for(int i=n-1;i>=0;i--){
            m=max(m,h[i]);
            maxr[i]=m;
        }
        int ans=0;
        for(int i=0;i<n;i++){
            ans+=min(maxl[i],maxr[i])-h[i];
        }
        return ans;
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
