import React from 'react'
import { useQuery } from 'react-query'   
// import { toast } from 'react-toastify';
import lodash from 'lodash';  
import actionService from '../connections/getdataaction';

interface Props {
    url: string,
    filter?: string,
    limit: number,
    newdata?: any,
    array?: any,
}

function InfiniteScrollerComponent(props: Props) {
    const {
        url,
        filter,
        limit,
        array, 
    } = props

    const [size, setSize] = React.useState(limit)
    const [hasNextPage, setHasNextPage] = React.useState(false);
    const [results, setResults] = React.useState([] as any) 
    const intObserver = React.useRef<IntersectionObserver>();

    const { data, isLoading, refetch, isRefetching } = useQuery([url], () => actionService.getservicedata(`${url}`, {
        params: {
          page: 1,
          limit: size, 
        }
      }), {
        onError: () => {
          // toast.error(error.response?.data);
        }, 
        
        onSuccess: (data: any) => {   
          if(!array) { 
            if(isRefetching){
              if(size === limit){
                setResults(lodash.uniqBy(data?.data?.data, filter ? filter : "id")); 
                // return
              } else if(size !== limit){ 
                  results.push(...data?.data?.data);   
                  setResults(lodash.uniqBy(results, filter ? filter : "id")); 
              } 
            } else {
              setResults(lodash.uniqBy(data?.data?.data, filter ? filter : "id")); 
            }
          } else { 
            if(isRefetching){
              if(size === limit){
                setResults(lodash.uniqBy(data?.data, filter ? filter : "id")); 
                // return
              } else if(size !== limit){ 
                  results.push(...data?.data);   
                  setResults(lodash.uniqBy(results, filter ? filter : "id")); 
              } 
            } else {
              setResults(lodash.uniqBy(data?.data, filter ? filter : "id")); 
            }
          }
            setHasNextPage(data?.data?.total > size ? false:true);
            window.scrollTo(0, window.innerHeight); 
        //   setData(data.data.content);
        }
    })  
    
    

    const ref = React.useCallback((post: any) => {
        if (isLoading && isRefetching) return;
        if (intObserver.current) intObserver.current.disconnect();
        intObserver.current = new IntersectionObserver((posts) => {
          if (posts[0].isIntersecting && hasNextPage && !isRefetching) {
            setSize(prev => prev + limit); 
            refetch() 
          }
        });
        if (post) intObserver.current.observe(post);
       }, [isLoading, hasNextPage, setSize, isRefetching, refetch, limit]);

    return {
        data,
        isLoading, 
        refetch, 
        results,
        ref,
        isRefetching
    }
}

export default InfiniteScrollerComponent
