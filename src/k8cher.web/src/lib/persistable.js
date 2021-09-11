import { writable } from 'svelte/store'
import { serverUrl } from '$lib/utils/env'
import { post, get } from '$lib/utils/apiHelper'

// potentials advances
// save to local storage and sync from there
// have flag, persist history, tracks all immutable changes, if function has name, track that
// add async option (does not wait for confirmation from server)

// tutorial to write:
// create and start new svelte app `npm init k8cher my-app`, cd my-app, npm install, npm run dev
// startup backend `tilt up` create one optimized for working on front end
// create a normal svelte store, can switch to persistable to save to backend

export function persistable(storeName, initialState) {
    let isLoading = false
    let value = initialState

    const { subscribe, set } = writable(initialState, async (setFunc) => {
        // this is executed on first subscriber
        const res = await get(`${serverUrl}store/${storeName}/get`)
        if (res.success) {
            console.log('success get store')
            if (Object.keys(res.json).length === 0) {
                // if resonpse is empty object '{}', initialize the store on the server
                setFunc(initialState)
            }
            else {
                value = res.json
                setFunc(value)
            }
        }

        return () => console.log(`no more subscribers for store ${storeName}`)
    })

    async function persist(json) {
        isLoading = true
        const res = await post(`${serverUrl}store/${storeName}/set`, json)

        if (res.success) {
            value = json
            set(value)
        } else {
            // todo - mbk: how best to handle?
            console.log('update failed: ' + JSON.stringify(res))
        }

        isLoading = false
    }

    return {
        subscribe,
        update: async (updateFunc) => {
            console.log('function name: ' + updateFunc.name)

            persist(updateFunc(value))
        },
    }
}

