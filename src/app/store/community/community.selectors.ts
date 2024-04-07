import {createSelector} from "@ngrx/store";
import {AppState} from "../app.state";
import {CommunityState} from "./community.reducer";
import {User} from "../user/user.model";

export const selectCommunityState = (state: AppState) => state.communityState;

export const selectAllUsers = createSelector(
    selectCommunityState,
    (communityState: CommunityState) => communityState.users
);

export const selectUser = (uid: string) => createSelector(
    selectAllUsers,
    (users: User[]) =>
        users.filter((u) => u.id === uid)
);

