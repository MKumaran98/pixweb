import {createContext, useReducer, useEffect,useContext} from 'react';
import {AuthContext} from './AuthReducer'
import axios from 'axios'
import { successToast, warningToast } from '../UI/Toast/Toast';

export const CatagoriesContext=createContext();

export const CatagoriesProvider=({children})=>{

    const {userId,token} =useContext(AuthContext)

    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const catagoriesManipulation=(state,action)=>{
        switch (action.type) {
            case "CREATE_VIDEOLIST":
                return{
                    ...state,
                    fullVideoList:[...action.payload]
                }
            case "CREATE_PLAYLIST":
                return{
                    ...state,
                    playlists:[...action.payload]
                }
            case "FILTER_VIDEO_BY_CATAGORY":
                return{
                    ...state,
                    currentCatagoryId:action.payload,
                    selectedVideo:state.fullVideoList.filter(({catagoryId})=>+catagoryId===+action.payload)[0]
                }
            case "SELECT_VIDEO":
                return{
                    ...state,
                    selectedVideo:{...action.payload}
                }
            case "ADD_TO_HISTORY":
                return{
                    ...state,
                    history:[...action.payload]
                }
            case "ADD_NOTES_TO_VIDEO":
                return{
                    ...state,
                    playlists:[...action.payload.playlist],
                    fullVideoList:[...action.payload.fullVideosList],
                    history:[...action.payload.history],
                    selectedVideo:{...state.selectedVideo,notes:[...state.selectedVideo.notes,action.payload.note]}
                }
            default:
                return state;
        }
    }

    const [state,dispatch]=useReducer(catagoriesManipulation,{
        fullVideoList:[],
        currentCatagoryId:null,
        selectedVideo:null,
        playlists:[],
        history:[]
    });

    const addVideoToPlaylist=async(selectedVideo,playlist)=>{
        let currentPlaylist=null;
        state.playlists.forEach(playlist=>{
            if(playlist.videos.some(item=>item._id===selectedVideo._id))
                currentPlaylist=playlist._id;
        })
        
        try{
            if(!currentPlaylist){
                const {data}=await axios.put(`/api/playlists/${playlist._id}/video/${selectedVideo._id}`,null,config)
                if(data.ok){
                    successToast("Video added to playlist")
                    dispatch({
                        type:"CREATE_PLAYLIST",
                        payload:state.playlists.map(item=>item._id===data.data._id?data.data:item)
                    })
                }
            }else if(currentPlaylist===playlist._id){
                const {data}=await axios.delete(`/api/playlists/${playlist._id}/video/${selectedVideo._id}`,config)
                if(data.ok){
                    successToast("Video removed from playlist")
                    dispatch({
                        type:"CREATE_PLAYLIST",
                        payload:state.playlists.map(item=>item._id===data.data._id?data.data:item)
                    })
                }
            }else if(currentPlaylist!==playlist.id){
                const {data}=await axios.delete(`/api/playlists/${currentPlaylist}/video/${selectedVideo._id}`,config)
                
                const {data:addVideo}=await axios.put(`/api/playlists/${playlist._id}/video/${selectedVideo._id}`,null,config)
                    if(addVideo.ok){
                        successToast("Video added to playlist")
                        dispatch({
                            type:"CREATE_PLAYLIST",
                            payload:state.playlists.map(item=>{
                                if(item._id===data.data._id)
                                    return data.data;
                                else if(item._id===addVideo.data._id)
                                    return addVideo.data
                                else
                                    return item
                            })
                        })
                    }
                }
        }catch(error){
            console.log(error)
            warningToast("Unable to add video to playlist")
        }
    }

    const addNewPlaylist=async (newPlaylistName)=>{
        try{
            const {data}=await axios.post(`/api/playlists/${userId}`,{
                name:newPlaylistName
            },config)
            if(data.ok){
                dispatch({
                    type:"CREATE_PLAYLIST",
                    payload:[...state.playlists,data.data]
                })
                successToast("Playlist added")
            }
        }catch(error){
            console.log(error)
            warningToast("Unable to add playlist")
        }
    }

    const deletePlaylist=async (playlistid)=>{
        try{
            const {data}=await axios.delete(`/api/playlists/${playlistid}/users/${userId}`,config)
            if(data.ok){
                successToast("Playlist has been deleted")
                dispatch({
                    type:"CREATE_PLAYLIST",
                    payload:[...data.data]
                })
            }
        }catch(error){
            console.log(error)
            warningToast("Unable to delete playlist")
        }
    }

    const addNotes=async (videoId,note)=>{
        const {status,data}=await axios.post("/api/add-note-to-video",{
            videoId,note
        })
        if(+status===201){
            dispatch({
                type:"ADD_NOTES_TO_VIDEO",
                payload:{
                    playlist:[...data.playlist.models],
                    fullVideosList:[...data.fullVideosList.models],
                    history:[...data.history.models],
                    note:note
                }
            })
        }
    }

    

    const getFilteredData=(videoList,id)=>{
        if(id)
            return videoList.filter(item=>+item.catagoryId===+id)
        return []
    }

    const filteredData=getFilteredData(state.fullVideoList,state.currentCatagoryId)

    const addToHistory=async (videoId)=>{
        if(state.selectedVideo && token){
            try{
                const {data}=await axios.put(`/api/histories/${videoId}/users/${userId}`,null,config)
                dispatch({
                    type:"ADD_TO_HISTORY",
                    payload:[...data.data]
                })
            }catch(error){
                console.log(error)
                warningToast("Unable to add video to history")
            }
        }
    }

    useEffect(()=>{
        (async()=>{
            try{
                if(token&&userId){
                    const {data}=await axios.get(`/api/histories/${userId}`,config)
                    dispatch({
                        type:"ADD_TO_HISTORY",
                        payload:[...data.data]
                    })
                }
            }catch(error){
                warningToast("Unable to load history")
                console.log(error)
            }
        })()
    },[userId,token])

    useEffect(()=>{
        (async()=>{
            try{
            const {data}=await axios.get("/api/videos")
            if(data.ok){
                dispatch({
                    type:"CREATE_VIDEOLIST",
                    payload:[...data.data]
                })
            }
            }catch(error){
                warningToast("Unable to load videos")
                console.log(error)
            }
        })()
    },[])

    useEffect(()=>{
        (
            async()=>{
                try{
                if(token&&userId){
                    const {data:{data}}=await axios.get(`/api/playlists/${userId}`,config)
                    dispatch({
                        type:"CREATE_PLAYLIST",
                        payload:[...data]
                    })
                }
                }catch(error){
                    warningToast("Unable to load playlists")
                }
            }
        )()
    },[userId,token])

    return(
        <CatagoriesContext.Provider 
            value={{
                dispatch:dispatch,
                videosByCatagory:filteredData,
                selectedVideo:state.selectedVideo,
                addVideoToPlaylist:addVideoToPlaylist,
                playlists:state.playlists,
                addNewPlaylist:addNewPlaylist,
                addToHistory:addToHistory,
                deletePlaylist:deletePlaylist,
                history:state.history,
                addNotes:addNotes
            }}
        >
            {children}
        </CatagoriesContext.Provider>
    )
}